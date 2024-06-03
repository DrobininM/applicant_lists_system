from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from api.controllers import city_controller
from api.dto.city_dto import CityDTO
from api.routers.get_session import get_session
from typing import List

city_router = APIRouter()


@city_router.get("/", description="Receive all the cities from DB", response_model=List[CityDTO])
def get_all_cities(db_session: Session = Depends(get_session)) -> list[CityDTO]:
    return city_controller.get_all_cities(db_session)
