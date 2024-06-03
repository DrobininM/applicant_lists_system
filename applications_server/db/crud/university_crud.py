from db.models.university import University
from db.crud.crud_base import CrudBase
from sqlalchemy import select, and_


class UniversityCrud(CrudBase):
    def create_university(self, university_name: str, city_id: int) -> University:
        new_university = University(universityName=university_name, cityId=city_id)
        self._add_to_db(new_university)

        return new_university

    def get_university_by_name(self, name: str) -> University | None:
        query = select(University).where(University.universityName == name)

        query_row = self._select_one_by_query(query)

        if query_row is not None:
            return query_row[0]

    def get_all_universities(self) -> list[University]:
        query = select(University)

        query_row = self._db_session.execute(query)
        rows = query_row.fetchall()

        return [row[0] for row in rows]

    def get_university(self, name: str, city_id: int) -> University | None:
        query = select(University).where(and_(University.universityName == name, University.cityId == city_id))

        query_row = self._select_one_by_query(query)

        if query_row is not None:
            return query_row[0]
