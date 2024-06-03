from sqlalchemy.orm import Session
from api.dto.enrollment_period_dto import EnrollmentPeriodDTO, EnrollmentPeriodCreationDTO
from db.crud.enrollment_period_crud import EnrollmentPeriodCrud


def get_all_enrollment_periods(db_session: Session) -> list[EnrollmentPeriodDTO]:
    crud = EnrollmentPeriodCrud(db_session)

    periods = crud.get_all_periods()

    return [
        EnrollmentPeriodDTO(period_id=period.id, period_start_date=period.startDate, period_end_date=period.endDate)
        for period in periods
    ]


def create_enrollment_period(period_dto: EnrollmentPeriodCreationDTO, db_session: Session) -> bool:
    crud = EnrollmentPeriodCrud(db_session)
    crud.create_period(period_dto.period_start_date, period_dto.period_end_date)

    return True


def edit_enrollment_period(period_dto: EnrollmentPeriodDTO, db_session: Session) -> bool:
    crud = EnrollmentPeriodCrud(db_session)
    crud.update_period(period_dto.period_id, period_dto.period_start_date, period_dto.period_end_date)

    return True


def remove_enrollment_period(period_id: int, db_session: Session) -> bool:
    crud = EnrollmentPeriodCrud(db_session)
    crud.remove_period(period_id)

    return True
