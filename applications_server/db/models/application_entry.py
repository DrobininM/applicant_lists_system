from sqlalchemy import Column, Integer, ForeignKey, DateTime
from db.base import Base
from datetime import datetime
from db.models.application import Application
from db.models.person import Person
from utils.helpers import get_random


class ApplicationEntry(Base):
    __tablename__ = "ApplicationEntry"

    id = Column(Integer, unique=True, nullable=False, default=get_random)

    personId = Column(Integer, ForeignKey(Person.id, ondelete="CASCADE", onupdate="CASCADE"),
                      primary_key=True, index=True)

    applicationId = Column(Integer, ForeignKey(Application.id, ondelete="CASCADE", onupdate="CASCADE"),
                           primary_key=True, index=True)

    personCompetitivePosition = Column(Integer, unique=False, nullable=False)
    editDate = Column(DateTime, unique=False, nullable=True)
    creationDate = Column(DateTime, unique=False, nullable=False, default=datetime.now())
