import datetime

from db.models.person_extra_info import PersonExtraInfo
from db.crud.crud_base import CrudBase
from sqlalchemy import select, and_, update


class PersonExtraInfoCrud(CrudBase):
    def create_person_extra_score(self, person_id: int, university_id: int, enrollment_period_id: int,
                                  submitted_diploma: bool, extra_score: int) -> PersonExtraInfo:
        new_extra_info = PersonExtraInfo(personId=person_id, universityId=university_id,
                                         enrollmentPeriodId=enrollment_period_id, submittedDiploma=submitted_diploma,
                                         extraScore=extra_score)

        self._add_to_db(new_extra_info)

        return new_extra_info

    def create_or_update(self, person_id: int, university_id: int, enrollment_period_id: int,
                         submitted_diploma: bool, extra_score: int) -> int:
        possible_entry = self.get_person_extra_info(person_id, university_id, enrollment_period_id)

        if possible_entry is None:
            return self.create_person_extra_score(person_id, university_id, enrollment_period_id,
                                                  submitted_diploma, extra_score).id

        query = update(PersonExtraInfo).where(PersonExtraInfo.id == int(possible_entry.id))\
            .values(submittedDiploma=submitted_diploma, editDate=datetime.datetime.now())

        self._update_entry(query)

        return possible_entry.id


    def get_person_extra_info(self, person_id: int, university_id: int, enrollment_period_id: int)\
            -> PersonExtraInfo | None:
        query = select(PersonExtraInfo).where(and_(PersonExtraInfo.personId == person_id,
                                                   PersonExtraInfo.universityId == university_id,
                                                   PersonExtraInfo.enrollmentPeriodId == enrollment_period_id))

        query_row = self._select_one_by_query(query)

        if query_row is not None:
            return query_row[0]
