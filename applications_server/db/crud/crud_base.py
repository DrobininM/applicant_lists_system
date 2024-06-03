from sqlalchemy.orm import Session
from abc import ABCMeta


class CrudBase(object):
    __metaclass__ = ABCMeta

    def __init__(self, db_session: Session):
        self._db_session = db_session

    def _add_to_db(self, entry):
        self._db_session.add(entry)
        self._db_session.commit()
        self._db_session.refresh(entry)

    def _update_entry(self, query):
        query_row = self._db_session.execute(query)
        self._db_session.commit()

        return query_row

    def _select_one_by_query(self, query):
        res = self._db_session.execute(query)

        return res.fetchone()

    def _delete(self, query):
        self._db_session.execute(query)
        self._db_session.commit()
