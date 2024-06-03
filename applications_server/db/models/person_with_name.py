from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from db.base import Base
from datetime import datetime
from db.models.person import Person
from utils.helpers import get_random


class PersonWithName(Base):
    __tablename__ = "PersonWithName"

    id = Column(Integer, unique=True, nullable=False, default=get_random)

    personId = Column(Integer, ForeignKey(Person.id, ondelete="CASCADE", onupdate="CASCADE"),
                      primary_key=True, index=True)

    firstName = Column(String, unique=False, nullable=False)
    secondName = Column(String, unique=False, nullable=False)
    patronymic = Column(String, unique=False, nullable=True)
    creationDate = Column(DateTime, unique=False, nullable=False, default=datetime.now())
