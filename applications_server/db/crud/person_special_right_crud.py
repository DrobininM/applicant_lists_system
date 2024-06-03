from sqlalchemy import select, and_
from db.models.person_special_right import PersonSpecialRight
from db.crud.crud_base import CrudBase


class PersonSpecialRightCrud(CrudBase):
    def create_person_special_right(self, person_id: int, special_right_id: int, enrollment_period_id: int)\
            -> PersonSpecialRight:
        new_person_special_right = PersonSpecialRight(personId=person_id, specialRightId=special_right_id,
                                                      enrollmentPeriodId=enrollment_period_id)

        self._add_to_db(new_person_special_right)

        return new_person_special_right

    def get_person_special_rights(self, person_id: int, enrollment_period_id: int) -> list[PersonSpecialRight]:
        query = select(PersonSpecialRight).where(and_(PersonSpecialRight.personId == person_id,
                                                      PersonSpecialRight.enrollmentPeriodId == enrollment_period_id))

        query_row = self._db_session.execute(query)
        rows = query_row.fetchall()

        return [row[0] for row in rows]
