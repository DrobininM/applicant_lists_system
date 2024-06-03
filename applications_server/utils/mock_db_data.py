from db.base import SessionLocal
from db.crud.application_crud import ApplicationCrud
from db.crud.application_info_crud import ApplicationInfoCrud
from db.crud.application_subject_crud import ApplicationSubjectCrud
from db.crud.city_crud import CityCrud
from db.crud.competition_type_crud import CompetitionTypeCrud
from db.crud.educational_program_crud import EducationalProgramCrud
from db.crud.enrollment_period_crud import EnrollmentPeriodCrud
from db.crud.field_of_study_crud import FieldOfStudyCrud
from db.crud.study_mode_crud import StudyModeCrud
from db.crud.subject_crud import SubjectCrud
from db.crud.university_crud import UniversityCrud
from db.crud.university_program_crud import UniversityProgramCrud
from db.crud.university_with_field_crud import UniversityWithFieldCrud
from datetime import datetime
from utils import applicant_list_consts


def fill_with_mock_data():
    session = SessionLocal()

    __create_cities(session)
    __create_universities(session)
    __create_fields_of_study(session)
    fields_id = __create_university_fields(session)
    progs_id = __create_programs(session)
    univer_progs_id = __create_university_programs(session, fields_id, progs_id)
    infos_id = __create_application_infos(session, univer_progs_id)
    periods_id = __create_periods(session)
    appls_id = __create_applications(session, infos_id, periods_id)
    subjects_id = __create_subjects(session)
    __create_appl_subjects(session, appls_id, subjects_id)


def __create_cities(session):
    crud = CityCrud(session)

    crud.create_city("Пермь")
    crud.create_city("Москва")
    crud.create_city("Санкт-Петербург")


def __create_universities(session):
    city_crud = CityCrud(session)

    perm = city_crud.get_city_by_name("Пермь")
    moscow = city_crud.get_city_by_name("Москва")
    spb = city_crud.get_city_by_name("Санкт-Петербург")

    university_crud = UniversityCrud(session)

    university_crud.create_university("НИУ-ВШЭ", perm.id)
    university_crud.create_university("НИУ-ВШЭ", moscow.id)
    university_crud.create_university("ИТМО", spb.id)


def __create_fields_of_study(session):
    crud = FieldOfStudyCrud(session)

    crud.create_field_of_study("09.03.04 Программная инженерия")
    crud.create_field_of_study("38.04.05 Бизнес-информатика")
    crud.create_field_of_study("40.03.01 Юриспруденция")


def __create_university_fields(session):
    university_crud = UniversityCrud(session)

    hse = university_crud.get_university_by_name("НИУ-ВШЭ")
    itmo = university_crud.get_university_by_name("ИТМО")

    field_crud = FieldOfStudyCrud(session)

    pi = field_crud.get_field_by_name("09.03.04 Программная инженерия")
    bi = field_crud.get_field_by_name("38.04.05 Бизнес-информатика")
    yur = field_crud.get_field_by_name("40.03.01 Юриспруденция")

    univer_field_crud = UniversityWithFieldCrud(session)

    entry1 = univer_field_crud.create_university_with_field(hse.id, pi.id)
    entry2 = univer_field_crud.create_university_with_field(hse.id, bi.id)
    entry3 = univer_field_crud.create_university_with_field(itmo.id, pi.id)
    entry4 = univer_field_crud.create_university_with_field(itmo.id, yur.id)

    return [entry1.id, entry2.id, entry3.id, entry4.id]


def __create_programs(session):
    crud = EducationalProgramCrud(session)

    entry1 = crud.create_program("Программная инженерия")
    entry2 = crud.create_program("Цифровой юрист")
    entry3 = crud.create_program("Юриспруденция")
    entry4 = crud.create_program("Право")
    entry5 = crud.create_program("Бизнес-информатика: цифровое предприятие и управление информационными системами")

    return [entry1.id, entry2.id, entry3.id, entry4.id, entry5.id]


def __create_university_programs(session, fields_id, progs_id):
    crud = UniversityProgramCrud(session)

    entry1 = crud.create_university_program(fields_id[0], progs_id[0]) #pi pi
    entry2 = crud.create_university_program(fields_id[1], progs_id[4]) #bi bi
    entry3 = crud.create_university_program(fields_id[2], progs_id[0]) #pi pi
    entry4 = crud.create_university_program(fields_id[3], progs_id[1]) #yur dig
    entry5 = crud.create_university_program(fields_id[3], progs_id[2]) #yur yur
    entry6 = crud.create_university_program(fields_id[3], progs_id[3]) #yur pravo

    return [entry1.id, entry2.id, entry3.id, entry4.id, entry5.id, entry6.id]


def __create_application_infos(session, progs_id):
    study_mode_crud = StudyModeCrud(session)

    full = study_mode_crud.find_study_mode_by_name(applicant_list_consts.FULL_TIME)
    part = study_mode_crud.find_study_mode_by_name(applicant_list_consts.PART_TIME)
    full_part = study_mode_crud.find_study_mode_by_name(applicant_list_consts.FULL_PART_TIME)

    competition_crud = CompetitionTypeCrud(session)

    budget = competition_crud.find_competition_type_by_name(applicant_list_consts.BUDGET)
    com = competition_crud.find_competition_type_by_name(applicant_list_consts.COMMERCIAL)
    target = competition_crud.find_competition_type_by_name(applicant_list_consts.TARGETED)

    application_info_crud = ApplicationInfoCrud(session)

    entry1 = application_info_crud.create_application_info(progs_id[0], full.id, budget.id) #pi
    entry2 = application_info_crud.create_application_info(progs_id[0], full.id, com.id)
    entry3 = application_info_crud.create_application_info(progs_id[0], part.id, com.id)

    entry4 = application_info_crud.create_application_info(progs_id[1], full.id, budget.id) #bi
    entry5 = application_info_crud.create_application_info(progs_id[1], full.id, target.id)

    entry6 = application_info_crud.create_application_info(progs_id[2], full.id, budget.id) #pi
    entry7 = application_info_crud.create_application_info(progs_id[2], full_part.id, com.id)

    entry8 = application_info_crud.create_application_info(progs_id[3], full.id, com.id) #yur
    entry9 = application_info_crud.create_application_info(progs_id[3], part.id, com.id)

    entry10 = application_info_crud.create_application_info(progs_id[4], full.id, com.id)
    entry11 = application_info_crud.create_application_info(progs_id[4], full_part.id, com.id)

    entry12 = application_info_crud.create_application_info(progs_id[5], full.id, budget.id)
    entry13 = application_info_crud.create_application_info(progs_id[5], part.id, com.id)

    return [entry1.id, entry2.id, entry3.id, entry4.id, entry5.id, entry6.id, entry7.id, entry8.id, entry9.id,
            entry10.id, entry11.id, entry12.id, entry13.id]


def __create_periods(session):
    crud = EnrollmentPeriodCrud(session)

    entry1 = crud.create_period(datetime(2022, 7, 5), datetime(2022, 8, 9))
    entry2 = crud.create_period(datetime(2023, 6, 30), datetime(2023, 8, 10))
    entry3 = crud.create_period(datetime(2024, 7, 2))

    return [entry1.id, entry2.id, entry3.id]


def __create_applications(session, infos_id, periods_id):
    crud = ApplicationCrud(session)

    entry1 = crud.create_application(infos_id[0], periods_id[1], 40, 30, 5) #pi
    entry2 = crud.create_application(infos_id[0], periods_id[2], 50, 40, 6)

    entry3 = crud.create_application(infos_id[1], periods_id[0], 0, 38, 0)
    entry4 = crud.create_application(infos_id[1], periods_id[1], 40, 30, 5)

    entry5 = crud.create_application(infos_id[2], periods_id[0], 0, 28, 0)

    entry6 = crud.create_application(infos_id[3], periods_id[2], 45, 24, 7) #bi

    entry7 = crud.create_application(infos_id[4], periods_id[2], 45, 24, 7)

    entry8 = crud.create_application(infos_id[5], periods_id[0], 45, 24, 0) #pi
    entry9 = crud.create_application(infos_id[5], periods_id[2], 50, 29, 5)

    entry10 = crud.create_application(infos_id[6], periods_id[0], 0, 12, 0)
    entry11 = crud.create_application(infos_id[6], periods_id[1], 0, 11, 0)

    entry12 = crud.create_application(infos_id[7], periods_id[0], 0, 14, 4) #yur
    entry13 = crud.create_application(infos_id[7], periods_id[1], 0, 17, 3)
    entry14 = crud.create_application(infos_id[7], periods_id[2], 0, 15, 3)

    entry15 = crud.create_application(infos_id[8], periods_id[2], 0, 6, 0)

    entry16 = crud.create_application(infos_id[9], periods_id[1], 0, 18, 0)

    entry17 = crud.create_application(infos_id[10], periods_id[1], 0, 5, 0)
    entry18 = crud.create_application(infos_id[10], periods_id[2], 0, 4, 0)

    entry19 = crud.create_application(infos_id[11], periods_id[2], 70, 45, 4)

    entry20 = crud.create_application(infos_id[12], periods_id[2], 0, 10, 0)

    return [entry1.id, entry2.id, entry3.id, entry4.id, entry5.id, entry6.id, entry7.id, entry8.id, entry9.id,
            entry10.id, entry11.id, entry12.id, entry13.id, entry14.id, entry15.id, entry16.id, entry17.id,
            entry18.id, entry19.id, entry20.id]


def __create_subjects(session):
    crud = SubjectCrud(session)

    entry1 = crud.create_subject("Русский язык")
    entry2 = crud.create_subject("Математика")
    entry3 = crud.create_subject("Информатика")
    entry4 = crud.create_subject("Английский")
    entry5 = crud.create_subject("Обществознание")

    return [entry1.id, entry2.id, entry3.id, entry4.id, entry5.id]


def __create_appl_subjects(session, appls_id, subjects_id):
    crud = ApplicationSubjectCrud(session)

    crud.create_application_subject(appls_id[0], subjects_id[0]) #pi
    crud.create_application_subject(appls_id[0], subjects_id[1])
    crud.create_application_subject(appls_id[0], subjects_id[2])

    crud.create_application_subject(appls_id[1], subjects_id[0])
    crud.create_application_subject(appls_id[1], subjects_id[1])
    crud.create_application_subject(appls_id[1], subjects_id[2])

    crud.create_application_subject(appls_id[2], subjects_id[0])
    crud.create_application_subject(appls_id[2], subjects_id[1])
    crud.create_application_subject(appls_id[2], subjects_id[2])

    crud.create_application_subject(appls_id[3], subjects_id[0])
    crud.create_application_subject(appls_id[3], subjects_id[1])
    crud.create_application_subject(appls_id[3], subjects_id[2])

    crud.create_application_subject(appls_id[4], subjects_id[0])
    crud.create_application_subject(appls_id[4], subjects_id[1])
    crud.create_application_subject(appls_id[4], subjects_id[2])

    crud.create_application_subject(appls_id[5], subjects_id[0]) #bi
    crud.create_application_subject(appls_id[5], subjects_id[1])
    crud.create_application_subject(appls_id[5], subjects_id[3])

    crud.create_application_subject(appls_id[6], subjects_id[0])
    crud.create_application_subject(appls_id[6], subjects_id[1])
    crud.create_application_subject(appls_id[6], subjects_id[3])

    crud.create_application_subject(appls_id[7], subjects_id[0]) #pi
    crud.create_application_subject(appls_id[7], subjects_id[1])
    crud.create_application_subject(appls_id[7], subjects_id[2])

    crud.create_application_subject(appls_id[8], subjects_id[0])
    crud.create_application_subject(appls_id[8], subjects_id[1])
    crud.create_application_subject(appls_id[8], subjects_id[2])

    crud.create_application_subject(appls_id[9], subjects_id[0])
    crud.create_application_subject(appls_id[9], subjects_id[1])
    crud.create_application_subject(appls_id[9], subjects_id[2])

    crud.create_application_subject(appls_id[10], subjects_id[0])
    crud.create_application_subject(appls_id[10], subjects_id[1])
    crud.create_application_subject(appls_id[10], subjects_id[2])

    crud.create_application_subject(appls_id[11], subjects_id[0]) # yur
    crud.create_application_subject(appls_id[11], subjects_id[1])
    crud.create_application_subject(appls_id[11], subjects_id[3])
    crud.create_application_subject(appls_id[11], subjects_id[4])

    crud.create_application_subject(appls_id[12], subjects_id[0])
    crud.create_application_subject(appls_id[12], subjects_id[1])
    crud.create_application_subject(appls_id[12], subjects_id[3])
    crud.create_application_subject(appls_id[12], subjects_id[4])

    crud.create_application_subject(appls_id[13], subjects_id[0])
    crud.create_application_subject(appls_id[13], subjects_id[1])
    crud.create_application_subject(appls_id[13], subjects_id[3])
    crud.create_application_subject(appls_id[13], subjects_id[4])

    crud.create_application_subject(appls_id[14], subjects_id[0])
    crud.create_application_subject(appls_id[14], subjects_id[1])
    crud.create_application_subject(appls_id[14], subjects_id[3])
    crud.create_application_subject(appls_id[14], subjects_id[4])

    crud.create_application_subject(appls_id[15], subjects_id[0])
    crud.create_application_subject(appls_id[15], subjects_id[1])
    crud.create_application_subject(appls_id[15], subjects_id[3])
    crud.create_application_subject(appls_id[15], subjects_id[4])

    crud.create_application_subject(appls_id[16], subjects_id[0])
    crud.create_application_subject(appls_id[16], subjects_id[1])
    crud.create_application_subject(appls_id[16], subjects_id[3])
    crud.create_application_subject(appls_id[16], subjects_id[4])

    crud.create_application_subject(appls_id[17], subjects_id[0])
    crud.create_application_subject(appls_id[17], subjects_id[1])
    crud.create_application_subject(appls_id[17], subjects_id[3])
    crud.create_application_subject(appls_id[17], subjects_id[4])

    crud.create_application_subject(appls_id[18], subjects_id[0])
    crud.create_application_subject(appls_id[18], subjects_id[1])
    crud.create_application_subject(appls_id[18], subjects_id[3])
    crud.create_application_subject(appls_id[18], subjects_id[4])

    crud.create_application_subject(appls_id[19], subjects_id[0])
    crud.create_application_subject(appls_id[19], subjects_id[1])
    crud.create_application_subject(appls_id[19], subjects_id[3])
    crud.create_application_subject(appls_id[19], subjects_id[4])
