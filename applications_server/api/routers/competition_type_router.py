from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from api.controllers import competition_type_controller
from api.dto.competition_type_dto import CompetitionTypeDTO
from api.routers.get_session import get_session
from typing import List

competition_type_router = APIRouter()


@competition_type_router.get("/", response_model=List[CompetitionTypeDTO])
def get_all_competition_types(db_session: Session = Depends(get_session)) -> list[CompetitionTypeDTO]:
    return competition_type_controller.get_all_competition_types(db_session)


@competition_type_router.get("/program_competition_types", response_model=List[CompetitionTypeDTO])
def get_program_competition_types(university_id: int, field_of_study_id: int, program_id: int, study_mode_id: int,
                                  db_session: Session = Depends(get_session)) -> list[CompetitionTypeDTO] | None:
    return competition_type_controller.get_program_competition_types(university_id, field_of_study_id, program_id,
                                                                     study_mode_id, db_session)
