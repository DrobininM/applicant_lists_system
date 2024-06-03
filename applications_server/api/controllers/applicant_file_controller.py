import datetime
import os

import pandas as pd
from fastapi import UploadFile
from pandas import DataFrame
from sqlalchemy import select
from sqlalchemy.orm import Session
from api.dto.application_file_dto import ApplicationFileDTO
from api.dto.application_requirement_dto import ApplicationRequirementDTO, requirement_dto_from_dict
from api.dto.application_schema_dto import ApplicationSchemaDTO
from api.dto.selection_table_cell_dto import SelectionTableCellDTO, cell_dto_from_dict
from db.crud.actual_application_crud import ActualApplicationCrud
from db.crud.application_crud import ApplicationCrud
from db.crud.application_entry_crud import ApplicationEntryCrud
from db.crud.application_info_crud import ApplicationInfoCrud
from db.crud.application_requirement_crud import ApplicationRequirementCrud
from db.crud.application_subject_crud import ApplicationSubjectCrud
from db.crud.city_crud import CityCrud
from db.crud.educational_program_crud import EducationalProgramCrud
from db.crud.field_of_study_crud import FieldOfStudyCrud
from db.crud.person_crud import PersonCrud
from db.crud.person_extra_info_crud import PersonExtraInfoCrud
from db.crud.person_score_crud import PersonScoreCrud
from db.crud.person_special_right_crud import PersonSpecialRightCrud
from db.crud.special_right_crud import SpecialRightCrud
from db.crud.subject_crud import SubjectCrud
from db.crud.university_crud import UniversityCrud
from db.crud.university_program_crud import UniversityProgramCrud
from db.crud.university_with_field_crud import UniversityWithFieldCrud
from db.models.actual_application import ActualApplication
from db.models.application import Application
from db.models.application_info import ApplicationInfo
from db.models.city import City
from db.models.educational_program import EducationalProgram
from db.models.field_of_study import FieldOfStudy
from db.models.university import University
from db.models.university_program import UniversityProgram
from db.models.university_with_field_of_study import UniversityWithFieldOfStudy
from db.mongo.application_schema_crud import ApplicationSchemaCrud
from db.mongo.base import mongo_collection
from parsing import applicant_list_entries_parser
from parsing.base.application_row import ApplicationRow
from utils.applicant_list_consts import FIRST_SPECIAL_RIGHT


def process_new_file(file: UploadFile, db_session: Session) -> ApplicationFileDTO:
    _, file_extension = os.path.splitext(file.filename)

    if file_extension == ".xlsx" or file_extension == ".xls":
        df = pd.read_excel(file.file)
    elif file_extension == ".html" or file_extension == ".htm":
        df = pd.read_html(file.file)[0]
    else:
        raise ValueError("'" + file_extension + "' file extension is not supported")

    row_count = len(df)
    column_count = len(df.columns)

    requirements_crud = ApplicationRequirementCrud(db_session)

    requirements = [ApplicationRequirementDTO(requirement_id=requirement.id,
                                              requirement_name=requirement.requirementName,
                                              substitution_requirement_id=requirement.substitutionRequirementId,
                                              is_classification_required=requirement.isClassificationRequired)
                    for requirement in requirements_crud.get_all_requirements()]

    cells = []

    df.T.map(lambda value: cells.append(SelectionTableCellDTO(cell_content=__get_content(value))))

    return ApplicationFileDTO(requirements=requirements, selection_cells=cells,
                              row_count=row_count, column_count=column_count)


def create_new_applicant_list(application_schema: ApplicationSchemaDTO, isUpdating: bool, db_session: Session):
    file_schema = application_schema.application_file
    df = __create_data_frame(file_schema.selection_cells, file_schema.row_count, file_schema.column_count)
    requirements = application_schema.application_file.requirements

    subject_id_list = [__create_subject(requirement.requirement_name, db_session)
                       for requirement in requirements if requirement.is_subject]

    if isUpdating:
        application_id, university_id = edit_applicant_list_schema(application_schema, db_session)
    else:
        application, university_id = __create_application_model(application_schema, db_session)
        application_id = application.id

    for subject_id in subject_id_list:
        __create_application_subject(application_id, subject_id, db_session)

    if application_schema.application_link is not None:
        __create_actual_application(application_id, application_schema.application_link, db_session)
    else:
        __remove_actual_application(application_id, db_session)

    applicant_rows = applicant_list_entries_parser.parse(df, requirements)
    subject_name_list = [requirement.requirement_name for requirement in requirements if requirement.is_subject]

    add_people_info(applicant_rows, subject_name_list, application_schema.enrollment_period_id, university_id,
                    application_id, db_session)

    __save_file_schema(application_id, requirements, file_schema.selection_cells, file_schema.row_count,
                       file_schema.column_count)


def add_people_info(application_rows: list[ApplicationRow], subject_name_list: list[str],
                    enrollment_period_id: int, university_id: int, application_id: int, session: Session):
    for application_row in application_rows:
        person_id = __create_person(application_row.insurance_number, session)

        __create_person_score(person_id, application_row.subject_point_list, subject_name_list,
                              enrollment_period_id, session)

        __create_person_extra_info(person_id, university_id, enrollment_period_id, application_row.extra_score,
                                   application_row.submitted_diploma, session)

        __set_special_right(person_id, enrollment_period_id, application_row.has_special_right, session)

        __create_application_entry(person_id, application_id, application_row.position_in_list,
                                   application_row.admission_agreement, application_row.priority, session)



def get_saved_applicant_list_schema(application_id: int, db_session: Session) -> ApplicationSchemaDTO | None:
    query = select(City.cityName, University.universityName, FieldOfStudy.fieldOfStudyName,
                   EducationalProgram.programName, Application.enrollmentPeriodId, ApplicationInfo.studyModeId,
                   ApplicationInfo.competitionTypeId, Application.budgetSeatNumber, Application.commercialSeatNumber,
                   Application.targetedSeatNumber, ActualApplication.applicationLink).select_from(Application)\
        .join(ActualApplication, isouter=True).join(ApplicationInfo).join(UniversityProgram).join(EducationalProgram)\
        .join(UniversityWithFieldOfStudy).join(FieldOfStudy).join(University).join(City)\
        .where(Application.id == application_id)

    res = db_session.execute(query)
    result = res.fetchone()

    if result is None:
        return None

    file_schema = __get_file_schema(application_id)

    return ApplicationSchemaDTO(city_name=result[0], university_name=result[1], field_of_study_name=result[2],
                                program_name=result[3], enrollment_period_id=result[4], study_mode_id=result[5],
                                competition_type_id=result[6], budget_seats=result[7], commercial_seats=result[8],
                                targeted_seats=result[9], application_file=file_schema, application_id=application_id,
                                application_link=result[10])


def remove_applicant_list(application_id: int, db_session: Session):
    ApplicationCrud(db_session).delete_application(application_id)
    ApplicationSchemaCrud(mongo_collection).delete_schema_by_application_id(application_id)


def edit_applicant_list_schema(application_schema: ApplicationSchemaDTO, db_session: Session) -> (int, int):
    application_info_id, university_id = __create_application_info_by_schema(application_schema, db_session)

    crud = ApplicationCrud(db_session)

    crud.update_application(application_schema.application_id, application_info_id,
                            application_schema.enrollment_period_id, application_schema.budget_seats,
                            application_schema.commercial_seats, application_schema.targeted_seats)

    return application_schema.application_id, university_id


def __get_content(value):
    if value is None or str(value) == "nan":
        return ""

    return str(value)


def __create_application_info_by_schema(application_schema: ApplicationSchemaDTO, session: Session) -> (int, int):
    city_id = __create_city(application_schema.city_name, session)
    university_id = __create_university(application_schema.university_name, city_id, session)
    field_of_study_id = __create_field_of_study(application_schema.field_of_study_name, session)
    university_with_field_id = __create_university_with_field(university_id, field_of_study_id, session)

    program_id = __create_program(application_schema.program_name, session)
    university_program_id = __create_university_program(university_with_field_id, program_id, session)

    return __create_application_info(university_program_id, application_schema.study_mode_id,
                                     application_schema.competition_type_id, session), university_id


def __create_application_model(application_schema: ApplicationSchemaDTO, session: Session)\
        -> (Application, int):
    application_info_id, university_id = __create_application_info_by_schema(application_schema, session)

    application_crud = ApplicationCrud(session)

    return application_crud.create_or_update(application_info_id, application_schema.enrollment_period_id,
                                             application_schema.budget_seats, application_schema.commercial_seats,
                                             application_schema.targeted_seats), university_id


def __create_city(city_name: str, session: Session) -> int:
    crud = CityCrud(session)

    possible_city = crud.get_city_by_name(city_name)

    if possible_city is None:
        return crud.create_city(city_name).id

    return possible_city.id


def __create_university(university_name, city_id, session: Session) -> int:
    crud = UniversityCrud(session)

    possible_university = crud.get_university(university_name, city_id)

    if possible_university is None:
        return crud.create_university(university_name, city_id).id

    return possible_university.id


def __create_field_of_study(field_of_study_name: str, session: Session) -> int:
    crud = FieldOfStudyCrud(session)

    possible_field = crud.get_field_by_name(field_of_study_name)

    if possible_field is None:
        return crud.create_field_of_study(field_of_study_name).id

    return possible_field.id


def __create_university_with_field(university_id, field_of_study_id, session: Session) -> int:
    crud = UniversityWithFieldCrud(session)

    return crud.create_if_not_exist(university_id, field_of_study_id).id


def __create_program(program_name, session: Session) -> int:
    crud = EducationalProgramCrud(session)

    return crud.create_if_not_exist(program_name).id


def __create_university_program(university_with_field_id: int, program_id: int, session: Session) -> int:
    crud = UniversityProgramCrud(session)

    return crud.create_if_not_exist(university_with_field_id, program_id).id


def __create_application_info(university_program_id, study_mode_id, competition_type_id, session: Session) -> int:
    crud = ApplicationInfoCrud(session)

    return crud.create_if_not_exist(university_program_id, study_mode_id, competition_type_id).id


def __create_actual_application(application_id: int, application_link: str, session: Session):
    crud = ActualApplicationCrud(session)

    crud.create_if_not_exist(application_id, application_link, datetime.datetime.now())


def __remove_actual_application(application_id: int, session: Session):
    crud = ActualApplicationCrud(session)

    crud.delete_actual_application(application_id)


def __create_subject(subject_name: str, session: Session) -> int:
    crud = SubjectCrud(session)

    return crud.create_if_not_exist(subject_name).id


def __create_application_subject(application_id: int, subject_id: int, session: Session):
    crud = ApplicationSubjectCrud(session)

    crud.create_if_not_exist(application_id, subject_id)


def __create_person(insurance_number: str, session: Session) -> int:
    crud = PersonCrud(session)

    return crud.create_if_not_exist(insurance_number).id


def __create_person_score(person_id: int, subject_score_list: list[int], subject_name_list: list[str],
                          enrollment_period_id: int, session: Session):
    person_score_crud = PersonScoreCrud(session)
    subject_crud = SubjectCrud(session)

    for i, subject_score in enumerate(subject_score_list):
        subject_name = subject_name_list[i]

        person_score_crud.create_if_not_exist(person_id, subject_crud.get_subject_by_name(subject_name).id,
                                              enrollment_period_id, subject_score)


def __create_person_extra_info(person_id: int, university_id: int, enrollment_period_id: int,
                               extra_score: int, submitted_diploma: bool, session: Session):
    crud = PersonExtraInfoCrud(session)

    crud.create_or_update(person_id, university_id, enrollment_period_id, submitted_diploma, extra_score)


def __set_special_right(person_id: int, enrollment_period_id: int, has_special_right: bool, session: Session):
    if not has_special_right:
        return

    person_special_right_crud = PersonSpecialRightCrud(session)

    if len(person_special_right_crud.get_person_special_rights(person_id, enrollment_period_id)) > 0:
        return

    special_right_crud = SpecialRightCrud(session)

    special_right_id = special_right_crud.find_special_right_by_name(FIRST_SPECIAL_RIGHT).id

    person_special_right_crud.create_person_special_right(person_id, special_right_id, enrollment_period_id)


def __create_application_entry(person_id: int, application_id: int, competitive_position: int,
                               has_agreement: bool | None, priority: int | None, session: Session):
    crud = ApplicationEntryCrud(session)
    entry = crud.get_application_entry(person_id, application_id)

    if entry is not None:
        entry_with_agreement = crud.get_application_entry_with_agreement(entry.id)

        if entry_with_agreement is not None and priority is not None:
            crud.remove_entry_with_agreement(entry.id)
        elif entry_with_agreement is None and has_agreement is not None:
            crud.remove_entry_with_priority(entry.id)

    entry_id = crud.create_or_update_application_entry(person_id, application_id, competitive_position)

    if has_agreement is not None:
        crud.create_or_update_entry_with_agreement(entry_id, has_agreement)
    else:
        crud.create_or_update_entry_with_priority(entry_id, priority)


def __save_file_schema(application_id: int, requirements: list[ApplicationRequirementDTO],
                       table_cells: list[SelectionTableCellDTO], row_count: int, column_count: int):
    requirements_to_save = [requirement.to_dict() for requirement in requirements]
    cells_to_save = [cell.to_dict() for cell in table_cells]

    crud = ApplicationSchemaCrud(mongo_collection)

    crud.add_or_update_schema(application_id, requirements_to_save, cells_to_save, row_count, column_count)


def __get_file_schema(application_id: int) -> ApplicationFileDTO:
    crud = ApplicationSchemaCrud(mongo_collection)
    req_dict_list, cell_dict_list, row_count, column_count = crud.get_schema_by_application_id(application_id)

    requirements = [requirement_dto_from_dict(requirement_dict) for requirement_dict in req_dict_list]

    cells = [cell_dto_from_dict(cell_dict) for cell_dict in cell_dict_list]

    return ApplicationFileDTO(requirements=requirements, selection_cells=cells,
                              row_count=row_count, column_count=column_count)


def __create_data_frame(cells: list[SelectionTableCellDTO], row_count: int, column_count: int) -> DataFrame:
    df = pd.DataFrame(columns=[i for i in range(column_count)])

    for i in range(row_count):
        start_index = i * column_count
        cells_to_add = [cell.cell_content for cell in cells[start_index:column_count+start_index]]

        df.loc[len(df)] = cells_to_add

    return df
