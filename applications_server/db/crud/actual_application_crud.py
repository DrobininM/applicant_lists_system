from datetime import datetime
from db.models.actual_application import ActualApplication
from db.crud.crud_base import CrudBase
from sqlalchemy import select, delete

from db.models.application import Application
from db.models.application_info import ApplicationInfo
from db.models.university_program import UniversityProgram
from db.models.university_with_field_of_study import UniversityWithFieldOfStudy


class ActualApplicationCrud(CrudBase):
    def create_actual_application(self, application_id: int, application_link: str,
                                  last_check_date: datetime | None = None) -> ActualApplication:
        new_entry = ActualApplication(applicationId=application_id, applicationLink=application_link,
                                      lastCheckDate=last_check_date)

        self._add_to_db(new_entry)

        return new_entry

    def create_if_not_exist(self, application_id: int, application_link: str,
                            last_check_date: datetime | None = None) -> ActualApplication:
        possible_entry = self.get_actual_application(application_id)

        if possible_entry is None:
            return self.create_actual_application(application_id, application_link, last_check_date)

        return possible_entry

    def get_actual_application(self, application_id: int) -> ActualApplication | None:
        query = select(ActualApplication).where(ActualApplication.applicationId == application_id)

        query_row = self._select_one_by_query(query)

        if query_row is not None:
            return query_row[0]

    def get_all_actual_applications(self) -> list[ActualApplication]:
        query = select(ActualApplication)

        query_row = self._db_session.execute(query)
        rows = query_row.fetchall()

        return [row[0] for row in rows]

    def delete_actual_application(self, application_id: int):
        query = delete(ActualApplication).where(ActualApplication.applicationId == application_id)

        self._delete(query)

    def get_university_id_of_application(self, actual_application_id: int) -> int:
        query = select(UniversityWithFieldOfStudy.universityId).select_from(ActualApplication).join(Application)\
            .join(ApplicationInfo).join(UniversityProgram).join(UniversityWithFieldOfStudy)\
            .where(ActualApplication.id == actual_application_id)

        query_row = self._select_one_by_query(query)

        if query_row is not None:
            return query_row[0]
