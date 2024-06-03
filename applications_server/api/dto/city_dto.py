from api.dto.with_config import WithConfig


class CityDTO(WithConfig):
    city_id: int
    city_name: str
