from sqlalchemy.orm import Session
from sqlalchemy import select, Select, Row, and_
from api.dto.application_dto import ApplicationDTO, ApplicationRowDTO, LastApplicationFullDTO, ApplicationFullDTO
from api.dto.competition_type_dto import CompetitionTypeDTO
from api.dto.educational_program_dto import EducationalProgramDTO
from api.dto.enrollment_period_dto import EnrollmentPeriodDTO
from api.dto.field_of_study_dto import FieldOfStudyDTO
from api.dto.application_dto import LastApplicationDTO
from api.dto.study_mode_dto import StudyModeDTO
from api.dto.subject_dto import SubjectDTO
from api.dto.university_dto import UniversityDTO
from db.crud.enrollment_period_crud import EnrollmentPeriodCrud
from db.models.actual_application import ActualApplication
from db.models.application_entry import ApplicationEntry
from db.models.application_entry_with_agreement import ApplicationEntryWithAgreement
from db.models.application_entry_with_priority import ApplicationEntryWithPriority
from db.models.city import City
from db.models.enrollment_period import EnrollmentPeriod
from db.models.person import Person
from db.models.person_extra_info import PersonExtraInfo
from db.models.person_score import PersonScore
from db.models.person_special_right import PersonSpecialRight
from db.models.university import University
from db.models.application import Application
from db.models.application_info import ApplicationInfo
from db.models.university_program import UniversityProgram
from db.models.university_with_field_of_study import UniversityWithFieldOfStudy
from db.models.field_of_study import FieldOfStudy
from db.models.educational_program import EducationalProgram
from db.models.competition_type import CompetitionType
from db.models.study_mode import StudyMode
from db.models.subject import Subject
from db.models.application_subject import ApplicationSubject


def get_application(university_id: int, field_of_study_id: int, educational_program_id: int, competition_type_id: int,
                    study_mode_id: int, enrollment_period_id: int, db_session: Session) -> ApplicationDTO | None:
    query = __get_application_query(university_id, field_of_study_id, educational_program_id, competition_type_id,
                                    study_mode_id, enrollment_period_id)

    row = db_session.execute(query).fetchone()

    if row is None:
        return None

    return __create_application_by_row(row[0], db_session)


def get_last_application(university_id: int, field_of_study_id: int, educational_program_id: int,
                         competition_type_id: int, study_mode_id: int, db_session: Session)\
        -> LastApplicationDTO | None:
    query = __get_application_query(university_id, field_of_study_id, educational_program_id, competition_type_id,
                                    study_mode_id, None)

    query = query.order_by(EnrollmentPeriod.startDate.desc())

    application_row = db_session.execute(query).fetchone()

    if application_row is None:
        return None

    period_rows = db_session.execute(query).fetchall()

    application_dto = __create_application_by_row(application_row, db_session)
    period_dto_list = __create_period_dto_list(list(period_rows), db_session)

    return LastApplicationDTO(application=application_dto, period_list=period_dto_list)


def get_full_last_application(university_id: int, field_of_study_id: int, educational_program_id: int,
                              competition_type_id: int, study_mode_id: int, db_session: Session):
    last_application = get_last_application(university_id, field_of_study_id, educational_program_id,
                                            competition_type_id, study_mode_id, db_session)

    rows = __get_application_rows(last_application.application.application_id, db_session)

    return LastApplicationFullDTO(application=last_application, application_rows=rows)


def get_full_application(university_id: int, field_of_study_id: int, educational_program_id: int,
                         enrollment_period_id: int, competition_type_id: int, study_mode_id: int, db_session: Session):
    application = get_application(university_id, field_of_study_id, educational_program_id, competition_type_id,
                                  study_mode_id, enrollment_period_id, db_session)

    rows = __get_application_rows(application.application_id, db_session)

    return ApplicationFullDTO(application=application, application_rows=rows)


def get_applications(university_id: int | None, field_of_study_id: int | None, educational_program_id: int | None,
                     enrollment_period_id: int | None, db_session: Session) -> list[ApplicationDTO] | None:
    query = __get_application_query(university_id, field_of_study_id, educational_program_id, None, None,
                                    enrollment_period_id)

    rows = db_session.execute(query).fetchall()

    return [__create_application_by_row(row, db_session) for row in rows]


def __get_application_query(university_id: int | None, field_of_study_id: int | None,
                            educational_program_id: int | None, competition_type_id: int | None,
                            study_mode_id: int | None, enrollment_period_id: int | None) -> Select:
    query = select(Application.id, University.id, FieldOfStudy.id, EducationalProgram.id, StudyMode.id, StudyMode.mode,
                   CompetitionType.id, CompetitionType.type, EnrollmentPeriod.id, Application.budgetSeatNumber,
                   Application.commercialSeatNumber, Application.targetedSeatNumber, ActualApplication.applicationLink,
                   ActualApplication.lastCheckDate, University.universityName, City.id, City.cityName,
                   FieldOfStudy.fieldOfStudyName, EducationalProgram.programName, EnrollmentPeriod.startDate,
                   EnrollmentPeriod.endDate) \
        .join(ActualApplication, isouter=True) \
        .join(ApplicationInfo) \
        .join(UniversityProgram) \
        .join(StudyMode).join(CompetitionType) \
        .join(EducationalProgram) \
        .join(UniversityWithFieldOfStudy)\
        .join(University).join(FieldOfStudy).join(EnrollmentPeriod).join(City)

    if university_id is not None:
        query = query.where(University.id == university_id)

    if field_of_study_id is not None:
        query = query.where(FieldOfStudy.id == field_of_study_id)

    if educational_program_id is not None:
        query = query.where(EducationalProgram.id == educational_program_id)

    if competition_type_id is not None:
        query = query.where(CompetitionType.id == competition_type_id)

    if study_mode_id is not None:
        query = query.where(StudyMode.id == study_mode_id)

    if enrollment_period_id is not None:
        query = query.where(EnrollmentPeriod.id == enrollment_period_id)

    return query


def __get_subjects_of_application(application_id: int, db_session: Session) -> list[SubjectDTO]:
    query = select(Subject.id, Subject.subjectName).select_from(ApplicationSubject).join(Subject)\
        .where(ApplicationSubject.applicationId == application_id)

    rows = db_session.execute(query).fetchall()

    return [__create_subject_dto(row) for row in rows]


def __create_subject_dto(result_row: Row) -> SubjectDTO:
    return SubjectDTO(subject_id=result_row[0], subject_name=result_row[1])


def __create_application_by_row(result_row: Row, db_session: Session) -> ApplicationDTO:
    application_id = result_row[0]

    subject_dto_list = __get_subjects_of_application(application_id, db_session)

    return __create_application_dto(result_row, subject_dto_list)


def __create_application_dto(result_row: Row, subject_dto_list: list[SubjectDTO]) -> ApplicationDTO:
    return ApplicationDTO(application_id=result_row[0],
                          university=UniversityDTO(university_id=result_row[1], university_name=result_row[14],
                                                   city_id=result_row[15], city_name=result_row[16]),
                          field_of_study=FieldOfStudyDTO(field_of_study_id=result_row[2],
                                                         field_of_study_name=result_row[17]),
                          program=EducationalProgramDTO(program_id=result_row[3], program_name=result_row[18]),
                          study_mode=__create_study_mode_dto(result_row),
                          competition_type=__create_competition_type_dto(result_row),
                          enrollment_period=EnrollmentPeriodDTO(period_id=result_row[8],
                                                                period_start_date=result_row[19],
                                                                period_end_date=result_row[20]),
                          budget_seats=result_row[9], commercial_seats=result_row[10], targeted_seats=result_row[11],
                          subject_list=subject_dto_list, application_link=result_row[12],
                          last_check_date=result_row[13])


def __create_study_mode_dto(application_query_row: Row) -> StudyModeDTO:
    return StudyModeDTO(study_mode_id=application_query_row[4], study_mode_name=application_query_row[5])


def __create_competition_type_dto(application_query_row: Row) -> CompetitionTypeDTO:
    return CompetitionTypeDTO(competition_type_id=application_query_row[6],
                              competition_type_name=application_query_row[7])


def __create_period_dto_list(application_rows: list[Row], db_session: Session) -> list[EnrollmentPeriodDTO]:
    crud = EnrollmentPeriodCrud(db_session)
    periods = [crud.get_period_by_id(row[8]) for row in application_rows]

    return [EnrollmentPeriodDTO(period_id=period.id, period_start_date=period.startDate, period_end_date=period.endDate)
            for period in periods]


def __get_application_rows(applicationId: int, session: Session):
    query = select(ApplicationEntry.personCompetitivePosition, Person.insuranceNumber, PersonExtraInfo.submittedDiploma,
                   PersonSpecialRight.specialRightId, PersonExtraInfo.extraScore,
                   ApplicationEntryWithPriority.personPriority, ApplicationEntryWithAgreement.hasAgreement)\
        .join(Application).join(Person)\
        .join(PersonExtraInfo, and_(PersonExtraInfo.personId == Person.id,
                                    Application.enrollmentPeriodId == PersonExtraInfo.enrollmentPeriodId))\
        .join(PersonSpecialRight, isouter=True)\
        .join(ApplicationEntryWithPriority, isouter=True)\
        .join(ApplicationEntryWithAgreement, isouter=True).order_by(ApplicationEntry.personCompetitivePosition)\
        .where(Application.id == applicationId)

    subjects_query = select(Person.insuranceNumber, Subject.subjectName, PersonScore.score)\
        .select_from(ApplicationSubject).join(Subject).join(Application).join(ApplicationEntry).join(Person)\
        .join(PersonScore, and_(PersonScore.personId == Person.id,
                                Application.enrollmentPeriodId == PersonScore.enrollmentPeriodId,
                                PersonScore.subjectId == Subject.id))\
        .where(Application.id == applicationId).order_by(ApplicationEntry.personCompetitivePosition)

    rows = session.execute(query).fetchall()

    subject_rows = session.execute(subjects_query).fetchall()

    return [ApplicationRowDTO(competitive_position=row[0], insurance_number=row[1], submitted_diploma=row[2],
                              has_special_right=True if row[3] is not None else False,
                              scores=[{"subject_name": subject_row[1], "score": subject_row[2]}
                                      for subject_row in subject_rows if subject_row[0] == row[1]],
                              extra_score=row[4], priority=row[5], has_agreement=row[6]) for row in rows]
