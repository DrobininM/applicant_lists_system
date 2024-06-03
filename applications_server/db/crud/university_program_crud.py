from db.models.educational_program import EducationalProgram
from db.models.university_program import UniversityProgram
from db.crud.crud_base import CrudBase
from sqlalchemy import select, and_

from db.models.university_with_field_of_study import UniversityWithFieldOfStudy


class UniversityProgramCrud(CrudBase):
    def create_university_program(self, university_field_id: int, educational_program_id: int)\
            -> UniversityProgram:
        new_university_program = UniversityProgram(universityWithFieldOfStudyId=university_field_id,
                                                   educationalProgramId=educational_program_id)

        self._add_to_db(new_university_program)

        return new_university_program

    def create_if_not_exist(self, university_field_id: int, educational_program_id: int) -> UniversityProgram:
        possible_entry = self.get_university_program(university_field_id, educational_program_id)

        if possible_entry is None:
            return self.create_university_program(university_field_id, educational_program_id)

        return possible_entry

    def get_university_program(self, university_field_id: int, educational_program_id: int) -> UniversityProgram | None:
        query = select(UniversityProgram)\
            .where(and_(UniversityProgram.universityWithFieldOfStudyId == university_field_id,
                        UniversityProgram.educationalProgramId == educational_program_id))

        query_row = self._select_one_by_query(query)

        if query_row is not None:
            return query_row[0]

    def get_university_program_by_id(self, university_program_id: int) -> UniversityProgram | None:
        query = select(UniversityProgram).where(UniversityProgram.id == university_program_id)

        query_row = self._select_one_by_query(query)

        if query_row is not None:
            return query_row[0]

    def get_programs_by_university(self, university_id: int) -> list[EducationalProgram]:
        query = select(EducationalProgram).select_from(UniversityProgram)\
            .join(EducationalProgram)\
            .join(UniversityWithFieldOfStudy)\
            .where(UniversityWithFieldOfStudy.universityId == university_id)

        query_row = self._db_session.execute(query)
        rows = query_row.fetchall()

        return [row[0] for row in rows]

    def get_programs_by_field_of_study(self, field_of_study_id: int) -> list[EducationalProgram]:
        query = select(EducationalProgram).select_from(UniversityProgram)\
            .join(EducationalProgram)\
            .join(UniversityWithFieldOfStudy)\
            .where(UniversityWithFieldOfStudy.fieldOfStudyId == field_of_study_id)

        query_row = self._db_session.execute(query)
        rows = query_row.fetchall()

        return [row[0] for row in rows]

    def get_programs_by_university_and_field(self, university_id: int, field_of_study_id: int)\
            -> list[EducationalProgram]:
        query = select(EducationalProgram).select_from(UniversityProgram)\
            .join(EducationalProgram)\
            .join(UniversityWithFieldOfStudy)\
            .where(and_(UniversityWithFieldOfStudy.universityId == university_id,
                        UniversityWithFieldOfStudy.fieldOfStudyId == field_of_study_id))

        query_row = self._db_session.execute(query)
        rows = query_row.fetchall()

        return [row[0] for row in rows]
