from sqlalchemy import Column, Integer, String
from db.base import Base
from utils.helpers import get_random


class EducationalProgram(Base):
    __tablename__ = "EducationalProgram"

    id = Column(Integer, primary_key=True, index=True, default=get_random)
    programName = Column(String, unique=True, nullable=False)
