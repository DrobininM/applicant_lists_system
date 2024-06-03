from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from api.dto.university_dto import UniversityDTO
from api.routers.get_session import get_session
from typing import List
from api.controllers.university_controller import get_universities

university_router = APIRouter()


@university_router.get("/", description="Receive all the universities from DB", response_model=List[UniversityDTO])
def get_all_universities(db_session: Session = Depends(get_session)) -> list[UniversityDTO]:
    return get_universities(db_session)
