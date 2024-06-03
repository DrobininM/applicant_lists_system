from api.models.base import BaseDTO


class AdmissionPredictionDTO(BaseDTO):
    city_name: str
    university_name: str
    field_of_study_name: str
    program_name: str
    score_sum: int
    budget_seats: int
    submitted_diploma: bool
    has_priority_right: bool
    priority: int
    competitive_position: int
