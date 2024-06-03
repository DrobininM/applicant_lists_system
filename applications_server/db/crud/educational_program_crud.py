from db.models.educational_program import EducationalProgram
from db.crud.crud_base import CrudBase
from sqlalchemy import select
from db.models.university_program import UniversityProgram
from db.models.university_with_field_of_study import UniversityWithFieldOfStudy


class EducationalProgramCrud(CrudBase):
    def create_program(self, program_name: str) -> EducationalProgram:
        new_program = EducationalProgram(programName=program_name)
        self._add_to_db(new_program)

        return new_program

    def create_if_not_exist(self, program_name: str) -> EducationalProgram:
        possible_entry = self.get_program_by_name(program_name)

        if possible_entry is None:
            return self.create_program(program_name)

        return possible_entry

    def get_program_by_name(self, name: str) -> EducationalProgram | None:
        query = select(EducationalProgram).where(EducationalProgram.programName == name)

        query_row = self._select_one_by_query(query)
        if query_row is not None:
            return query_row[0]

    def get_all_programs(self) -> list[EducationalProgram]:
        query = select(EducationalProgram)

        query_row = self._db_session.execute(query)
        rows = query_row.fetchall()

        return [row[0] for row in rows]

    def get_direction_programs(self):
        query = select(UniversityWithFieldOfStudy.universityId, UniversityWithFieldOfStudy.fieldOfStudyId,
                       UniversityProgram.educationalProgramId, EducationalProgram.programName) \
            .select_from(UniversityProgram).join(UniversityWithFieldOfStudy).join(EducationalProgram)

        query_row = self._db_session.execute(query)
        rows = query_row.fetchall()

        return [row[0] for row in rows]

    def get_programs_by_id(self, id_list: list[int]) -> list[EducationalProgram]:
        query = select(EducationalProgram).where(EducationalProgram.id.in_(id_list))

        query_row = self._db_session.execute(query)
        rows = query_row.fetchall()

        return [row[0] for row in rows]
