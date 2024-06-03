from db.models.subject import Subject
from db.crud.crud_base import CrudBase
from sqlalchemy import select


class SubjectCrud(CrudBase):
    def create_subject(self, subject_name: str) -> Subject:
        new_subject = Subject(subjectName=subject_name)
        self._add_to_db(new_subject)

        return new_subject

    def create_if_not_exist(self, subject_name: str) -> Subject:
        possible_entry = self.get_subject_by_name(subject_name)

        if possible_entry is None:
            return self.create_subject(subject_name)

        return possible_entry

    def get_subject_by_name(self, name: str) -> Subject | None:
        query = select(Subject).where(Subject.subjectName == name)

        query_row = self._select_one_by_query(query)

        if query_row is not None:
            return query_row[0]
