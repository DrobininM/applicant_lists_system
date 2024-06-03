import time
import pandas as pd
from api.controllers.applicant_file_controller import get_saved_applicant_list_schema, add_people_info
from db.base import SessionLocal
from db.crud.actual_application_crud import ActualApplicationCrud
from db.crud.application_crud import ApplicationCrud
from parsing.applicant_list_entries_parser import parse
from parsing.consts import UPDATE_TIME_PAUSE_SEC
from parsing.helpers import get_temp_file_name, try_to_remove_temp_file, retrieve_page


def start_scrapping():
    session = SessionLocal()

    while True:
        crud = ActualApplicationCrud(session)

        actual_applications = crud.get_all_actual_applications()

        for actual_application in actual_applications:
            full_temp_file_name = get_temp_file_name(".x")

            try:
                retrieve_page(actual_application.applicationLink, full_temp_file_name)
                df = pd.read_excel(full_temp_file_name)
            except:
                try:
                    df = pd.read_html(full_temp_file_name)
                except:
                    print("Couldn't receive an applicant list: " + actual_application.applicationLink)
                    continue
            finally:
                try_to_remove_temp_file(full_temp_file_name)

            schema = get_saved_applicant_list_schema(actual_application.applicationId, session)
            application_rows = parse(df, schema.application_file.requirements)

            subject_name_list = [requirement.requirement_name for requirement in schema.application_file.requirements
                                 if requirement.is_subject]

            university_id = crud.get_university_id_of_application(actual_application.id)

            crud = ApplicationCrud(session)
            application = crud.get_application_by_id(actual_application.applicationId)

            add_people_info(application_rows, subject_name_list, application.enrollmentPeriodId, university_id,
                            application.id, session)

        time.sleep(UPDATE_TIME_PAUSE_SEC)
