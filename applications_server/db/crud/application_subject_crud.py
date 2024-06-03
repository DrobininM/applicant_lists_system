from db.models.application_subject import ApplicationSubject
from db.crud.crud_base import CrudBase
from sqlalchemy import select, and_


class ApplicationSubjectCrud(CrudBase):
    def create_application_subject(self, application_id: int, subject_id: int) -> ApplicationSubject:
        new_entry = ApplicationSubject(applicationId=application_id, subjectId=subject_id)

        self._add_to_db(new_entry)

        return new_entry

    def create_if_not_exist(self, application_id: int, subject_id: int) -> ApplicationSubject:
        possible_entry = self.get_application_subject(application_id, subject_id)

        if possible_entry is None:
            return self.create_application_subject(application_id, subject_id)

        return possible_entry

    def get_application_subject(self, application_id: int, subject_id: int) -> ApplicationSubject | None:
        query = select(ApplicationSubject)\
            .where(and_(ApplicationSubject.applicationId == application_id, ApplicationSubject.subjectId == subject_id))

        query_row = self._select_one_by_query(query)

        if query_row is not None:
            return query_row[0]
