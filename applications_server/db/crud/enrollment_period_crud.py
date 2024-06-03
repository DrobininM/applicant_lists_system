from db.models.enrollment_period import EnrollmentPeriod
from db.crud.crud_base import CrudBase
from sqlalchemy import select, update, delete
from datetime import datetime


class EnrollmentPeriodCrud(CrudBase):
    def create_period(self, start_date: datetime, end_date: datetime | None = None) -> EnrollmentPeriod:
        new_period = EnrollmentPeriod(startDate=start_date, endDate=end_date)
        self._add_to_db(new_period)

        return new_period

    def get_period_by_id(self, period_id: int) -> EnrollmentPeriod | None:
        query = select(EnrollmentPeriod).where(EnrollmentPeriod.id == period_id)

        query_row = self._select_one_by_query(query)

        if query_row is not None:
            return query_row[0]

    def get_all_periods(self) -> list[EnrollmentPeriod]:
        query = select(EnrollmentPeriod)

        query_row = self._db_session.execute(query)
        rows = query_row.fetchall()

        return [row[0] for row in rows]

    def update_period(self, period_id: int, start_date: datetime, end_date: datetime | None):
        query = update(EnrollmentPeriod).where(EnrollmentPeriod.id == period_id)\
            .values(startDate=start_date, endDate=end_date)

        self._update_entry(query)

    def remove_period(self, period_id: int):
        query = delete(EnrollmentPeriod).where(EnrollmentPeriod.id == period_id)

        self._delete(query)
