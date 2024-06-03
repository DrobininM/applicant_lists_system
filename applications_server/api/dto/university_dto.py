from api.dto.with_config import WithConfig


class UniversityDTO(WithConfig):
    university_id: int
    university_name: str
    city_id: int
    city_name: str
