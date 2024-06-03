from db.models.person import Person
from sqlalchemy import select
from db.crud.crud_base import CrudBase


class PersonCrud(CrudBase):
    def create_person(self, insurance_number: str) -> Person:
        new_person = Person(insuranceNumber=insurance_number)
        self._add_to_db(new_person)

        return new_person

    def create_if_not_exist(self, insurance_number: str) -> Person:
        possible_entry = self.get_person_by_insurance_number(insurance_number)

        if possible_entry is None:
            return self.create_person(insurance_number)

        return possible_entry

    def get_person_by_insurance_number(self, insurance_number: str) -> Person:
        query = select(Person).where(Person.insuranceNumber == insurance_number)

        query_row = self._select_one_by_query(query)

        if query_row is not None:
            return query_row[0]
