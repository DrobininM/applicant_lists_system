from dataclasses import dataclass
from api.dto.selection_range_dto import SelectionRangeDTO, range_dto_from_dict
from api.dto.with_config import WithConfig


@dataclass
class ApplicationRequirementDTO(WithConfig):
    requirement_id: int
    requirement_name: str
    range: SelectionRangeDTO | None = None
    is_subject: bool = False
    substitution_requirement_id: int | None = None
    is_classification_required: bool = False
    classification: str | None = None

    def __init__(self, **data):
        super().__init__(**data)

    def to_dict(self):
        return {
            "requirement_id": self.requirement_id,
            "requirement_name": self.requirement_name,
            "range": self.range.to_dict() if self.range is not None else None,
            "is_subject": self.is_subject,
            "substitution_requirement_id": self.substitution_requirement_id,
            "is_classification_required": self.is_classification_required,
            "classification": self.classification,
        }


def requirement_dto_from_dict(requirements_dict: dict) -> ApplicationRequirementDTO:
    req_range = requirements_dict.get("range")

    if req_range is not None:
        req_range = range_dto_from_dict(req_range)

    return ApplicationRequirementDTO(requirement_id=requirements_dict.get("requirement_id"),
                                     requirement_name=requirements_dict.get("requirement_name"),
                                     range=req_range,
                                     is_subject=requirements_dict.get("is_subject"),
                                     substitution_requirement_id=requirements_dict.get("substitution_requirement_id"),
                                     is_classification_required=requirements_dict.get("is_classification_required"),
                                     classification=requirements_dict.get("classification"))
