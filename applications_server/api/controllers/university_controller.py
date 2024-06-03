from sqlalchemy.orm import Session
from api.dto.university_dto import UniversityDTO
from db.crud.city_crud import CityCrud
from db.crud.university_crud import UniversityCrud


def get_universities(db_session: Session) -> list[UniversityDTO]:
    crud = UniversityCrud(db_session)

    universities = crud.get_all_universities()

    city_crud = CityCrud(db_session)
    city_names = [city_crud.get_city_by_id(university.cityId).cityName for university in universities]

    return [
        UniversityDTO(university_id=university.id, university_name=university.universityName,
                      city_id=university.cityId, city_name=city_names[i])
        for i, university in enumerate(universities)
    ]
