from dataclasses import dataclass


@dataclass
class ApplicationRow:
    position_in_list: int
    insurance_number: str
    admission_agreement: bool | None
    priority: int | None
    submitted_diploma: bool
    subject_point_list: list[int]
    extra_score: int
    has_special_right: bool
