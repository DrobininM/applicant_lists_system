from api.dto.with_config import WithConfig


class FieldOfStudyDTO(WithConfig):
    field_of_study_id: int
    field_of_study_name: str


class FilteredFieldOfStudyDTO(WithConfig):
    fields_of_study: list[FieldOfStudyDTO]
    total_count: int
