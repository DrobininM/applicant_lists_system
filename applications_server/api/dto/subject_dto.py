from api.dto.with_config import WithConfig


class SubjectDTO(WithConfig):
    subject_id: int
    subject_name: str
