from db.models.city import City
from db.crud.crud_base import CrudBase
from sqlalchemy import select


class CityCrud(CrudBase):
    def create_city(self, city_name: str) -> City:
        new_city = City(cityName=city_name)
        self._add_to_db(new_city)

        return new_city

    def get_all_cities(self) -> list[City]:
        query = select(City)

        query_row = self._db_session.execute(query)
        rows = query_row.fetchall()

        return [row[0] for row in rows]

    def get_city_by_id(self, city_id: int) -> City:
        query = select(City).where(City.id == city_id)

        query_row = self._select_one_by_query(query)

        if query_row is not None:
            return query_row[0]

    def get_city_by_name(self, city_name: str) -> City | None:
        query = select(City).where(City.cityName == city_name)

        query_row = self._select_one_by_query(query)

        if query_row is not None:
            return query_row[0]
