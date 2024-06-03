from db.models.person_with_name import PersonWithName
from db.crud.crud_base import CrudBase


class PersonWithNameCrud(CrudBase):
    def create_person_with_name(self, person_id: int, first_name: str, second_name: str,
                                patronymic: str) -> PersonWithName:
        new_person_with_name = PersonWithName(personId=person_id, firstName=first_name, secondName=second_name,
                                              patronymic=patronymic)

        self._add_to_db(new_person_with_name)

        return new_person_with_name
