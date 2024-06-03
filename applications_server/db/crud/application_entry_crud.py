from db.models.application import Application
from db.crud.crud_base import CrudBase
from sqlalchemy import select, and_, update, delete
from datetime import datetime
from db.models.application_entry import ApplicationEntry
from db.models.application_entry_with_agreement import ApplicationEntryWithAgreement
from db.models.application_entry_with_priority import ApplicationEntryWithPriority


class ApplicationEntryCrud(CrudBase):
    def create_application_entry(self, person_id: int, application_id: int, competitive_position: int,
                                 edit_date: datetime | None = None) -> ApplicationEntry:
        new_application_entry = ApplicationEntry(personId=person_id, applicationId=application_id,
                                                 personCompetitivePosition=competitive_position, editDate=edit_date)

        self._add_to_db(new_application_entry)

        return new_application_entry

    def create_or_update_application_entry(self, person_id: int, application_id: int, competitive_position: int)\
            -> int:
        possible_entry = self.get_application_entry(person_id, application_id)

        if possible_entry is None:
            return self.create_application_entry(person_id, application_id, competitive_position, datetime.now()).id

        query = update(ApplicationEntry).where(ApplicationEntry.id == int(possible_entry.id))\
            .values(personCompetitivePosition=competitive_position, editDate=datetime.now())

        self._update_entry(query)

        return possible_entry.id

    def get_application_entry(self, person_id: int, application_id: int) -> ApplicationEntry | None:
        query = select(ApplicationEntry).where(and_(ApplicationEntry.personId == person_id,
                                               ApplicationEntry.applicationId == application_id))

        query_row = self._select_one_by_query(query)

        if query_row is not None:
            return query_row[0]

    def create_or_update_entry_with_agreement(self, application_entry_id: int, has_agreement: bool) -> int:
        possible_entry = self.get_application_entry_with_agreement(application_entry_id)

        if possible_entry is None:
            return self.create_application_entry_with_agreement(application_entry_id, has_agreement, datetime.now()).id

        query = update(ApplicationEntryWithAgreement).where(ApplicationEntryWithAgreement.id == int(possible_entry.id))\
            .values(hasAgreement=has_agreement, editDate=datetime.now())

        self._update_entry(query)

        return possible_entry.id

    def create_application_entry_with_agreement(self, application_id: int, has_agreement: bool,
                                                edit_date: datetime | None = None) -> ApplicationEntryWithAgreement:
        new_application_entry = ApplicationEntryWithAgreement(applicationEntryId=application_id,
                                                              hasAgreement=has_agreement, editDate=edit_date)

        self._add_to_db(new_application_entry)

        return new_application_entry

    def get_application_entry_with_agreement(self, application_entry_id: int) -> ApplicationEntryWithAgreement | None:
        query = select(ApplicationEntryWithAgreement) \
            .where(ApplicationEntryWithAgreement.applicationEntryId == application_entry_id)

        query_row = self._select_one_by_query(query)

        if query_row is not None:
            return query_row[0]

    def create_or_update_entry_with_priority(self, application_entry_id: int, priority: int) -> int:
        possible_entry = self.get_application_entry_with_priority(application_entry_id)

        if possible_entry is None:
            return self.create_application_entry_with_priority(application_entry_id, priority, datetime.now()).id

        query = update(ApplicationEntryWithPriority).where(ApplicationEntryWithPriority.id == int(possible_entry.id))\
            .values(personPriority=priority, editDate=datetime.now())

        self._update_entry(query)

        return possible_entry.id

    def create_application_entry_with_priority(self, application_id: int, priority: int,
                                               edit_date: datetime | None = None) -> ApplicationEntryWithPriority:
        new_application_entry = ApplicationEntryWithPriority(applicationEntryId=application_id,
                                                             personPriority=priority, editDate=edit_date)

        self._add_to_db(new_application_entry)

        return new_application_entry

    def get_application_entry_with_priority(self, application_entry_id: int) -> ApplicationEntryWithPriority | None:
        query = select(ApplicationEntryWithPriority) \
            .where(ApplicationEntryWithPriority.applicationEntryId == application_entry_id)

        query_row = self._select_one_by_query(query)

        if query_row is not None:
            return query_row[0]

    def remove_entry_with_agreement(self, application_entry_id: int):
        query = delete(ApplicationEntryWithAgreement)\
            .where(ApplicationEntryWithAgreement.applicationEntryId == application_entry_id)

        self._delete(query)

    def remove_entry_with_priority(self, application_entry_id: int):
        query = delete(ApplicationEntryWithPriority) \
            .where(ApplicationEntryWithPriority.applicationEntryId == application_entry_id)

        self._delete(query)
