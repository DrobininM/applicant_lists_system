from api.dto.with_config import WithConfig


class StudyModeOldDTO(WithConfig):
    mode_id: int
    mode_name: str
    university_id: int
    direction_id: int
    program_id: int