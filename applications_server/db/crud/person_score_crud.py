from db.models.person_score import PersonScore
from db.crud.crud_base import CrudBase
from sqlalchemy import select, and_


class PersonScoreCrud(CrudBase):
    def create_person_score(self, person_id: int, subject_id: int, enrollment_period_id: int, score: int)\
            -> PersonScore:
        new_person_score = PersonScore(personId=person_id, subjectId=subject_id,
                                       enrollmentPeriodId=enrollment_period_id, score=score)
        self._add_to_db(new_person_score)

        return new_person_score

    def create_if_not_exist(self, person_id: int, subject_id: int, enrollment_period_id: int, score: int)\
            -> PersonScore:
        possible_entry = self.get_person_score(person_id, subject_id, enrollment_period_id)

        if possible_entry is None:
            return self.create_person_score(person_id, subject_id, enrollment_period_id, score)

        return possible_entry

    def get_person_score(self, person_id: int, subject_id: int, enrollment_period_id: int) -> PersonScore:
        query = select(PersonScore).where(and_(PersonScore.personId == person_id,
                                               PersonScore.subjectId == subject_id,
                                               PersonScore.enrollmentPeriodId == enrollment_period_id))

        query_row = self._select_one_by_query(query)

        if query_row is not None:
            return query_row[0]
