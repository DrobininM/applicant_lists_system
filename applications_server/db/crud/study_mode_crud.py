from db.models.study_mode import StudyMode
from db.crud.crud_base import CrudBase
from sqlalchemy import select


class StudyModeCrud(CrudBase):
    def create_study_mode(self, mode_name: str) -> StudyMode:
        new_mode = StudyMode(mode=mode_name)
        self._add_to_db(new_mode)

        return new_mode

    def find_study_mode_by_name(self, name: str) -> StudyMode:
        query = select(StudyMode).where(StudyMode.mode == name)

        query_row = self._select_one_by_query(query)

        if query_row is not None:
            return query_row[0]

    def get_all_study_modes(self) -> list[StudyMode]:
        query = select(StudyMode)

        query_row = self._db_session.execute(query)
        rows = query_row.fetchall()

        return [row[0] for row in rows]
