from sqlalchemy import Column, Integer, String
from db.base import Base
from utils.helpers import get_random


class StudyMode(Base):
    __tablename__ = "StudyMode"

    id = Column(Integer, primary_key=True, index=True, default=get_random)
    mode = Column(String, unique=True, nullable=False)
