from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from api.controllers import educational_program_controller
from api.dto.educational_program_dto import FilteredProgramDTO
from api.routers.get_session import get_session
from typing import Optional
from api.utils.helpers import split_data_by_offset

educational_program_router = APIRouter()


@educational_program_router.get("/", description="Receive educational programs from DB",
                                response_model=FilteredProgramDTO)
def get_programs(university_id: Optional[int] = None, field_of_study_id: Optional[int] = None, offset: int = 0,
                 count: int = 20, program_name: str | None = None, db_session: Session = Depends(get_session)) \
        -> FilteredProgramDTO | None:
    programs = educational_program_controller.get_programs(university_id, field_of_study_id, db_session)

    if programs is None:
        return None

    if program_name is None:
        programs, total_count = split_data_by_offset(programs, offset, count)
    else:
        programs, total_count = \
            split_data_by_offset(programs, offset, count, lambda entry: program_name in entry.field_of_study_name)

    return FilteredProgramDTO(programs=programs, total_count=total_count)
