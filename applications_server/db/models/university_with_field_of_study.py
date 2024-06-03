from sqlalchemy import Column, Integer, ForeignKey
from db.base import Base
from db.models.field_of_study import FieldOfStudy
from db.models.university import University
from utils.helpers import get_random


class UniversityWithFieldOfStudy(Base):
    __tablename__ = "UniversityWithFieldOfStudy"

    id = Column(Integer, unique=True, nullable=False, default=get_random)

    universityId = Column(Integer,
                          ForeignKey(University.id, ondelete="CASCADE", onupdate="CASCADE"),
                          primary_key=True, index=True)

    fieldOfStudyId = Column(Integer,
                            ForeignKey(FieldOfStudy.id, ondelete="CASCADE", onupdate="CASCADE"),
                            primary_key=True, index=True)
