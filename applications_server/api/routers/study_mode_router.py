from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from api.controllers import study_mode_controller
from api.dto.study_mode_dto import StudyModeDTO
from api.routers.get_session import get_session
from typing import List

study_mode_router = APIRouter()


@study_mode_router.get("/", response_model=List[StudyModeDTO])
def get_all_study_modes(db_session: Session = Depends(get_session)) -> list[StudyModeDTO]:
    return study_mode_controller.get_all_study_modes(db_session)


@study_mode_router.get("/program_study_modes", response_model=List[StudyModeDTO])
def get_program_study_modes(university_id: int, field_of_study_id: int, program_id: int,
                            db_session: Session = Depends(get_session)) -> list[StudyModeDTO]:
    return study_mode_controller.get_program_study_modes(university_id, field_of_study_id, program_id, db_session)
