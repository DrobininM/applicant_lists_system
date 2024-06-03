from sqlalchemy.orm import Session
from api.dto.city_dto import CityDTO
from db.crud.city_crud import CityCrud


def get_all_cities(db_session: Session) -> list[CityDTO]:
    crud = CityCrud(db_session)

    cities = crud.get_all_cities()

    return [CityDTO(city_id=city.id, city_name=city.cityName) for city in cities]
