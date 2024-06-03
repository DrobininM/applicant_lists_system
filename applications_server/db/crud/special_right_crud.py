from sqlalchemy import select
from db.models.special_right import SpecialRight
from db.crud.crud_base import CrudBase


class SpecialRightCrud(CrudBase):
    def create_special_right(self, name: str) -> SpecialRight:
        new_type = SpecialRight(specialRightName=name)
        self._add_to_db(new_type)

        return new_type

    def find_special_right_by_name(self, name: str) -> SpecialRight | None:
        query = select(SpecialRight).where(SpecialRight.specialRightName == name)

        query_row = self._select_one_by_query(query)

        if query_row is not None:
            return query_row[0]
