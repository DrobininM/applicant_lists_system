from api.dto.with_config import WithConfig


class ProgramOldDTO(WithConfig):
    program_id: int
    program_name: str
    university_id: int
    direction_id: int