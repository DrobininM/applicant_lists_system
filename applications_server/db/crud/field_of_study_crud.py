from db.models.field_of_study import FieldOfStudy
from db.crud.crud_base import CrudBase
from sqlalchemy import select


class FieldOfStudyCrud(CrudBase):
    def create_field_of_study(self, field_of_study_name: str) -> FieldOfStudy:
        new_field = FieldOfStudy(fieldOfStudyName=field_of_study_name)
        self._add_to_db(new_field)

        return new_field

    def get_field_by_name(self, name: str) -> FieldOfStudy | None:
        query = select(FieldOfStudy).where(FieldOfStudy.fieldOfStudyName == name)

        query_row = self._select_one_by_query(query)

        if query_row is not None:
            return query_row[0]

    def get_study_field_by_id(self, field_id: str) -> FieldOfStudy | None:
        query = select(FieldOfStudy).where(FieldOfStudy.id == field_id)

        query_row = self._select_one_by_query(query)

        if query_row is not None:
            return query_row[0]

    def get_all_fields_of_study(self) -> list[FieldOfStudy]:
        query = select(FieldOfStudy)

        query_row = self._db_session.execute(query)
        rows = query_row.fetchall()

        return [row[0] for row in rows]
