import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import settings
from db.base import Engine
from db.crud.application_requirement_crud import ApplicationRequirementCrud
from db.models import person, enrollment_period, application_entry, application_entry_with_agreement, \
    application_entry_with_priority, city, actual_application, application_subject, application_requirement
from db.models import subject
from db.models import university
from db.models import study_mode
from db.models import field_of_study
from db.models import educational_program
from db.models import competition_type
from db.models import special_right
from db.models import person_special_right
from db.models import person_with_name
from db.models import person_score
from db.models import person_extra_info
from db.models import university_with_field_of_study
from db.models import university_program
from db.models import application_info
from db.models import application
from db.crud.study_mode_crud import StudyModeCrud
from db.crud.competition_type_crud import CompetitionTypeCrud
from db.crud.special_right_crud import SpecialRightCrud
from db.base import SessionLocal
from utils import applicant_list_consts


def try_create_db():
    connection = psycopg2.connect(user=settings.DB_USER, password=settings.DB_PASSWORD, port=settings.DB_PORT)
    connection.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)

    cursor = connection.cursor()

    try:
        cursor.execute('create database ' + settings.DB_NAME)
    except Exception as e:
        print(e)

    cursor.close()
    connection.close()


def try_create_tables():
    class_list = [city, person, subject, university, study_mode, field_of_study, educational_program, competition_type,
                  special_right, enrollment_period, person_special_right, person_with_name, person_score,
                  person_extra_info, university_with_field_of_study, university_program,
                  application_info, application, application_subject, actual_application, application_entry,
                  application_entry_with_agreement, application_entry_with_priority, application_requirement]

    for class_name in class_list:
        try:
            class_name.Base.metadata.create_all(Engine)
        finally:
            pass

    session = SessionLocal()

    __try_add_study_modes(session)
    __try_add_competition_types(session)
    __try_add_special_rights(session)

    __try_add_application_requirements(session)


def __try_add_study_modes(session):
    values = [applicant_list_consts.FULL_TIME, applicant_list_consts.PART_TIME, applicant_list_consts.FULL_PART_TIME]
    study_mode_crud = StudyModeCrud(session)

    for value in values:
        if study_mode_crud.find_study_mode_by_name(value) is None:
            study_mode_crud.create_study_mode(value)


def __try_add_competition_types(session):
    values = [applicant_list_consts.BUDGET, applicant_list_consts.COMMERCIAL, applicant_list_consts.TARGETED,
              applicant_list_consts.WITHOUT_EXAMS]

    competition_type_crud = CompetitionTypeCrud(session)

    for value in values:
        if competition_type_crud.find_competition_type_by_name(value) is None:
            competition_type_crud.create_competition_type(value)


def __try_add_special_rights(session):
    values = [applicant_list_consts.FIRST_SPECIAL_RIGHT, applicant_list_consts.SECOND_SPECIAL_RIGHT,
              applicant_list_consts.THIRD_SPECIAL_RIGHT, applicant_list_consts.FOURTH_SPECIAL_RIGHT]

    special_right_crud = SpecialRightCrud(session)

    for value in values:
        if special_right_crud.find_special_right_by_name(value) is None:
            special_right_crud.create_special_right(value)


def __try_add_application_requirements(session):
    values = [applicant_list_consts.COMPETITIVE_POSITION, applicant_list_consts.INSURANCE_NUMBER,
              applicant_list_consts.SUBMITTED_DIPLOMA, applicant_list_consts.HAS_SPECIAL_RIGHT,
              applicant_list_consts.EXTRA_SCORE]

    id_list = [1, 2, 3, 6, 7]

    crud = ApplicationRequirementCrud(session)

    for i, value in enumerate(values):
        if crud.find_requirement_by_name(value) is None:
            req_id = id_list[i]

            if req_id == 3 or req_id == 6:
                crud.create_requirement(req_id, value, None, True)
            else:
                crud.create_requirement(req_id, value)

    if crud.find_requirement_by_name(applicant_list_consts.AGREEMENT) is None:
        crud.create_requirement(4, applicant_list_consts.AGREEMENT, None, True)
        crud.create_requirement(5, applicant_list_consts.PRIORITY, 4)

        crud.set_substitution_requirement_id(4, 5)
