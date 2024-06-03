from sqlalchemy import Column, Integer, ForeignKey, DateTime, Boolean
from db.base import Base
from datetime import datetime
from db.models.application_entry import ApplicationEntry
from utils.helpers import get_random


class ApplicationEntryWithAgreement(Base):
    __tablename__ = "ApplicationEntryWithAgreement"

    id = Column(Integer, unique=True, nullable=False, default=get_random)

    applicationEntryId = Column(Integer, ForeignKey(ApplicationEntry.id, ondelete="CASCADE", onupdate="CASCADE"),
                                primary_key=True, index=True)

    hasAgreement = Column(Boolean, unique=False, nullable=False)
    editDate = Column(DateTime, unique=False, nullable=True)
    creationDate = Column(DateTime, unique=False, nullable=False, default=datetime.now())
