from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from api.controllers import field_of_study_controller
from api.dto.field_of_study_dto import FilteredFieldOfStudyDTO
from api.routers.get_session import get_session
from typing import Optional
from api.utils.helpers import split_data_by_offset

field_of_study_router = APIRouter()


@field_of_study_router.get("/", description="Receive fields of study from DB",
                           response_model=FilteredFieldOfStudyDTO)
def get_fields_of_study(university_id: Optional[int] = None, offset: int = 0, count: int = 20,
                        field_of_study_name: str | None = None, db_session: Session = Depends(get_session))\
        -> FilteredFieldOfStudyDTO | None:
    fields_of_study = field_of_study_controller.get_fields_of_study(university_id, db_session)

    if fields_of_study is None:
        return None

    if field_of_study_name is None:
        fields_of_study, total_count = split_data_by_offset(fields_of_study, offset, count)
    else:
        fields_of_study, total_count =\
            split_data_by_offset(fields_of_study, offset, count,
                                 lambda entry: field_of_study_name in entry.field_of_study_name)

    return FilteredFieldOfStudyDTO(fields_of_study=fields_of_study, total_count=total_count)
