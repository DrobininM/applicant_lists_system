from sqlalchemy import Column, Integer, String
from db.base import Base
from utils.helpers import get_random


class FieldOfStudy(Base):
    __tablename__ = "FieldOfStudy"

    id = Column(Integer, primary_key=True, index=True, default=get_random)
    fieldOfStudyName = Column(String, unique=True, nullable=False)
