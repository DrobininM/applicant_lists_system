from api.dto.with_config import WithConfig


class StudyModeDTO(WithConfig):
    study_mode_id: int
    study_mode_name: str
