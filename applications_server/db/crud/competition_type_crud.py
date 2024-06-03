from db.models.competition_type import CompetitionType
from db.crud.crud_base import CrudBase
from sqlalchemy import select
from db.models.application_info import ApplicationInfo
from db.models.university_program import UniversityProgram
from db.models.university_with_field_of_study import UniversityWithFieldOfStudy


class CompetitionTypeCrud(CrudBase):
    def create_competition_type(self, competition_name: str) -> CompetitionType:
        new_type = CompetitionType(type=competition_name)
        self._add_to_db(new_type)

        return new_type

    def find_competition_type_by_name(self, name: str) -> CompetitionType:
        query = select(CompetitionType).where(CompetitionType.type == name)

        query_row = self._select_one_by_query(query)

        if query_row is not None:
            return query_row[0]

    def get_all_competition_types(self) -> list[CompetitionType]:
        query = select(CompetitionType)

        query_row = self._db_session.execute(query)
        rows = query_row.fetchall()

        return [row[0] for row in rows]

    def get_direction_competition_types(self):
        query = select(UniversityWithFieldOfStudy.universityId, UniversityWithFieldOfStudy.fieldOfStudyId,
                       UniversityProgram.educationalProgramId,
                       ApplicationInfo.competitionTypeId, CompetitionType.type)\
            .select_from(ApplicationInfo).join(UniversityProgram).join(UniversityWithFieldOfStudy)\
            .join(CompetitionType)

        query_row = self._db_session.execute(query)
        rows = query_row.fetchall()

        return [row for row in rows]
