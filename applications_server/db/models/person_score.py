from sqlalchemy import Column, Integer, DateTime, ForeignKey
from db.base import Base
from datetime import datetime
from db.models.enrollment_period import EnrollmentPeriod
from db.models.person import Person
from db.models.subject import Subject
from utils.helpers import get_random


class PersonScore(Base):
    __tablename__ = "PersonScore"

    id = Column(Integer, unique=True, nullable=False, default=get_random)

    personId = Column(Integer, ForeignKey(Person.id, ondelete="CASCADE", onupdate="CASCADE"),
                      primary_key=True, index=True)

    subjectId = Column(Integer, ForeignKey(Subject.id, ondelete="CASCADE", onupdate="CASCADE"),
                       primary_key=True, index=True)

    enrollmentPeriodId = Column(Integer, ForeignKey(EnrollmentPeriod.id, ondelete="CASCADE", onupdate="CASCADE"),
                                primary_key=True, index=True)

    score = Column(Integer, unique=False, nullable=True)
    creationDate = Column(DateTime, unique=False, nullable=False, default=datetime.now())
