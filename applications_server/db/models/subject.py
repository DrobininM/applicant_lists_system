from sqlalchemy import Column, Integer, String
from db.base import Base
from utils.helpers import get_random


class Subject(Base):
    __tablename__ = "Subject"

    id = Column(Integer, primary_key=True, index=True, default=get_random)
    subjectName = Column(String, unique=True, nullable=False)
