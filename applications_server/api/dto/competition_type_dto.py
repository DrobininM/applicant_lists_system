from api.dto.with_config import WithConfig


class CompetitionTypeDTO(WithConfig):
    competition_type_id: int
    competition_type_name: str
