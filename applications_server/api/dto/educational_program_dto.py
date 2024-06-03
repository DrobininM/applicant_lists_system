from api.dto.with_config import WithConfig


class EducationalProgramDTO(WithConfig):
    program_id: int
    program_name: str


class FilteredProgramDTO(WithConfig):
    programs: list[EducationalProgramDTO]
    total_count: int
