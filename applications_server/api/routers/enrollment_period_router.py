from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from api.controllers.enrollment_period_controller import create_enrollment_period, edit_enrollment_period, \
    remove_enrollment_period
from api.dto.enrollment_period_dto import EnrollmentPeriodDTO, EnrollmentPeriodCreationDTO
from api.dto.with_config import WithConfig
from api.routers.get_session import get_session
from typing import List
from api.controllers import enrollment_period_controller

enrollment_period_router = APIRouter()


class EnrollmentPeriodCreationDTOWrapper(WithConfig):
    period_dto: EnrollmentPeriodCreationDTO


class EnrollmentPeriodDTOWrapper(WithConfig):
    period_dto: EnrollmentPeriodDTO


@enrollment_period_router.get("/", description="Receive all the enrollment periods from DB",
                              response_model=List[EnrollmentPeriodDTO])
def get_all_enrollment_periods(db_session: Session = Depends(get_session)) -> list[EnrollmentPeriodDTO]:
    return enrollment_period_controller.get_all_enrollment_periods(db_session)


@enrollment_period_router.post("/create_period")
def create_new_period(period_dto: EnrollmentPeriodCreationDTOWrapper, db_session: Session = Depends(get_session))\
        -> bool:
    return create_enrollment_period(period_dto.period_dto, db_session)


@enrollment_period_router.post("/edit_period")
def edit_period(period_dto: EnrollmentPeriodDTOWrapper, db_session: Session = Depends(get_session)) -> bool:
    return edit_enrollment_period(period_dto.period_dto, db_session)


@enrollment_period_router.delete("/delete_period")
def delete_period(period_id: int, db_session: Session = Depends(get_session)) -> bool:
    return remove_enrollment_period(period_id, db_session)

