from api.dto.application_file_dto import ApplicationFileDTO
from api.dto.with_config import WithConfig


class ApplicationSchemaDTO(WithConfig):
    city_name: str
    university_name: str
    field_of_study_name: str
    program_name: str
    enrollment_period_id: int
    study_mode_id: int
    competition_type_id: int
    budget_seats: int
    commercial_seats: int
    targeted_seats: int
    application_file: ApplicationFileDTO
    application_id: int | None = None
    application_link: str | None = None
