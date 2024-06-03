from sqlalchemy import Column, Integer, ForeignKey, DateTime
from db.base import Base
from datetime import datetime
from db.models.competition_type import CompetitionType
from db.models.study_mode import StudyMode
from db.models.university_program import UniversityProgram
from utils.helpers import get_random


class ApplicationInfo(Base):
    __tablename__ = "ApplicationInfo"

    id = Column(Integer, unique=True, nullable=False, default=get_random)

    universityProgramId = Column(Integer, ForeignKey(UniversityProgram.id, ondelete="CASCADE", onupdate="CASCADE"),
                                 primary_key=True, index=True)

    studyModeId = Column(Integer, ForeignKey(StudyMode.id, ondelete="CASCADE", onupdate="CASCADE"),
                         primary_key=True, index=True)

    competitionTypeId = Column(Integer, ForeignKey(CompetitionType.id, ondelete="CASCADE", onupdate="CASCADE"),
                               primary_key=True, index=True)

    creationDate = Column(DateTime, unique=False, nullable=False, default=datetime.now())
