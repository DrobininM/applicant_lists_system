from sqlalchemy import Column, Integer, String, DateTime
from db.base import Base
from datetime import datetime
from utils.helpers import get_random


class Person(Base):
    __tablename__ = "Person"

    id = Column(Integer, primary_key=True, index=True, default=get_random)
    insuranceNumber = Column(String, index=True)
    creationDate = Column(DateTime, unique=False, nullable=False, default=datetime.now())
