from sqlalchemy import select, update
from db.models.application_requirement import ApplicationRequirement
from db.crud.crud_base import CrudBase


class ApplicationRequirementCrud(CrudBase):
    def create_requirement(self, requirement_id: int, name: str, substitution_requirement_id: int | None = None,
                           is_classification_required: bool = False)\
            -> ApplicationRequirement:
        new_requirement = ApplicationRequirement(id=requirement_id, requirementName=name,
                                                 substitutionRequirementId=substitution_requirement_id,
                                                 isClassificationRequired=is_classification_required)

        self._add_to_db(new_requirement)

        return new_requirement

    def find_requirement_by_name(self, name: str) -> ApplicationRequirement | None:
        query = select(ApplicationRequirement).where(ApplicationRequirement.requirementName == name)

        query_row = self._select_one_by_query(query)

        if query_row is not None:
            return query_row[0]

    def get_all_requirements(self) -> list[ApplicationRequirement]:
        query = select(ApplicationRequirement)

        query_row = self._db_session.execute(query)
        rows = query_row.fetchall()

        return [row[0] for row in rows]

    def set_substitution_requirement_id(self, requirement_id: int, substitution_id: int):
        query = update(ApplicationRequirement).where(ApplicationRequirement.id == requirement_id)\
            .values(substitutionRequirementId=substitution_id)

        self._update_entry(query)
