import datetime

from api.dto.city_dto import CityDTO
from api.dto.competition_type_dto import CompetitionTypeDTO
from api.dto.educational_program_dto import EducationalProgramDTO
from api.dto.enrollment_period_dto import EnrollmentPeriodDTO
from api.dto.field_of_study_dto import FieldOfStudyDTO
from api.dto.study_mode_dto import StudyModeDTO
from api.dto.subject_dto import SubjectDTO
from api.dto.university_dto import UniversityDTO
from api.dto.with_config import WithConfig


class ApplicationDTO(WithConfig):
    application_id: int
    university: UniversityDTO
    field_of_study: FieldOfStudyDTO
    program: EducationalProgramDTO
    study_mode: StudyModeDTO
    competition_type: CompetitionTypeDTO
    enrollment_period: EnrollmentPeriodDTO
    budget_seats: int
    commercial_seats: int
    targeted_seats: int
    subject_list: list[SubjectDTO]
    application_link: str | None
    last_check_date: datetime.datetime | None


class ApplicationRowDTO(WithConfig):
    competitive_position: int
    insurance_number: str
    submitted_diploma: bool
    has_special_right: bool
    scores: list[dict]
    extra_score: int
    priority: int | None = None
    has_agreement: bool | None = None


class ApplicationFullDTO(WithConfig):
    application: ApplicationDTO
    application_rows: list[ApplicationRowDTO]


class LastApplicationDTO(WithConfig):
    application: ApplicationDTO
    period_list: list[EnrollmentPeriodDTO]


class LastApplicationFullDTO(WithConfig):
    application: LastApplicationDTO
    application_rows: list[ApplicationRowDTO]


class FilteredApplicationDTO(WithConfig):
    applications: list[ApplicationDTO]
    total_count: int
