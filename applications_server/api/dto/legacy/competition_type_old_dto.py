from api.dto.with_config import WithConfig


class CompetitionTypeOldDTO(WithConfig):
    type_id: int
    type_name: str
    university_id: int
    direction_id: int
    program_id: int
    study_mode_id: int
