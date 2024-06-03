from db.models.application import Application
from db.crud.crud_base import CrudBase
from sqlalchemy import select, and_, delete, update


class ApplicationCrud(CrudBase):
    def create_application(self, application_info_id: int, enrollment_period_id: int, budget_seat_number: int,
                           commercial_seat_number: int, targeted_seat_number: int) -> Application:
        new_application = Application(applicationInfoId=application_info_id, enrollmentPeriodId=enrollment_period_id,
                                      budgetSeatNumber=budget_seat_number, commercialSeatNumber=commercial_seat_number,
                                      targetedSeatNumber=targeted_seat_number)

        self._add_to_db(new_application)

        return new_application

    def create_or_update(self, application_info_id: int, enrollment_period_id: int, budget_seat_number: int,
                         commercial_seat_number: int, targeted_seat_number: int) -> Application:
        possible_entry = self.get_application(application_info_id, enrollment_period_id)

        if possible_entry is None:
            return self.create_application(application_info_id, enrollment_period_id, budget_seat_number,
                                           commercial_seat_number, targeted_seat_number)

        query = update(Application).where(Application.id == int(possible_entry.id))\
            .values(budgetSeatNumber=budget_seat_number, commercialSeatNumber=commercial_seat_number,
                    targetedSeatNumber=targeted_seat_number)

        self._update_entry(query)

        return possible_entry

    def get_application(self, application_info_id: int, enrollment_period_id: int) -> Application | None:
        query = select(Application).where(and_(Application.applicationInfoId == application_info_id,
                                               Application.enrollmentPeriodId == enrollment_period_id))

        query_row = self._select_one_by_query(query)

        if query_row is not None:
            return query_row[0]

    def get_application_by_id(self, application_id: int) -> Application | None:
        query = select(Application).where(Application.id == application_id)

        query_row = self._select_one_by_query(query)

        if query_row is not None:
            return query_row[0]

    def delete_application(self, application_id: int):
        query = delete(Application).where(Application.id == application_id)

        self._delete(query)

    def update_application(self, application_id: int, new_application_info_id: int, new_period_id: int,
                           budget_seat_number: int, commercial_seat_number: int, targeted_seat_number: int):
        query = update(Application).where(Application.id == application_id)\
            .values(applicationInfoId=new_application_info_id, enrollmentPeriodId=new_period_id,
                    budgetSeatNumber=budget_seat_number, commercialSeatNumber=commercial_seat_number,
                    targetedSeatNumber=targeted_seat_number)

        self._update_entry(query)
