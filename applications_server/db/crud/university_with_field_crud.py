from db.models.university_with_field_of_study import UniversityWithFieldOfStudy
from db.models.field_of_study import FieldOfStudy
from db.crud.crud_base import CrudBase
from sqlalchemy import select, and_


class UniversityWithFieldCrud(CrudBase):
    def create_university_with_field(self, university_id: int, field_of_study_id: int)\
            -> UniversityWithFieldOfStudy:
        new_university_field = UniversityWithFieldOfStudy(universityId=university_id, fieldOfStudyId=field_of_study_id)
        self._add_to_db(new_university_field)

        return new_university_field

    def create_if_not_exist(self, university_id: int, field_of_study_id: int) -> UniversityWithFieldOfStudy:
        possible_entry = self.get_university_with_field(university_id, field_of_study_id)

        if possible_entry is None:
            return self.create_university_with_field(university_id, field_of_study_id)

        return possible_entry

    def get_university_with_field(self, university_id: int, field_of_study_id: int)\
            -> UniversityWithFieldOfStudy | None:
        query = select(UniversityWithFieldOfStudy)\
            .where(and_(UniversityWithFieldOfStudy.universityId == university_id,
                        UniversityWithFieldOfStudy.fieldOfStudyId == field_of_study_id))

        query_row = self._select_one_by_query(query)

        if query_row is not None:
            return query_row[0]

    def get_all_university_with_fields(self) -> list[UniversityWithFieldOfStudy] | None:
        query = select(UniversityWithFieldOfStudy.universityId, UniversityWithFieldOfStudy.fieldOfStudyId,
                       FieldOfStudy.fieldOfStudyName)\
            .select_from(UniversityWithFieldOfStudy).join(FieldOfStudy)

        query_row = self._db_session.execute(query)
        rows = query_row.fetchall()

        if rows is None:
            return None

        return [row[0] for row in rows]

    def get_fields_of_study_of_university(self, university_id: int) -> list[UniversityWithFieldOfStudy]:
        query = select(UniversityWithFieldOfStudy)\
            .where(UniversityWithFieldOfStudy.universityId == university_id)

        query_row = self._db_session.execute(query)
        rows = query_row.fetchall()

        if rows is None:
            return None

        return [row[0] for row in rows]
