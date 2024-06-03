from sqlalchemy import Column, Integer, ForeignKey, DateTime
from db.base import Base
from datetime import datetime
from db.models.educational_program import EducationalProgram
from db.models.university_with_field_of_study import UniversityWithFieldOfStudy
from utils.helpers import get_random


class UniversityProgram(Base):
    __tablename__ = "UniversityProgram"

    id = Column(Integer, unique=True, nullable=False, default=get_random)

    universityWithFieldOfStudyId = Column(Integer,
                                          ForeignKey(UniversityWithFieldOfStudy.id,
                                                     ondelete="CASCADE", onupdate="CASCADE"),
                                          primary_key=True, index=True)

    educationalProgramId = Column(Integer,
                                  ForeignKey(EducationalProgram.id, ondelete="CASCADE", onupdate="CASCADE"),
                                  primary_key=True, index=True)

    creationDate = Column(DateTime, unique=False, nullable=False, default=datetime.now())
