from sqlalchemy import Column, Integer, ForeignKey, DateTime, Boolean
from db.base import Base
from datetime import datetime
from db.models.enrollment_period import EnrollmentPeriod
from db.models.person import Person
from db.models.university import University
from utils.helpers import get_random


class PersonExtraInfo(Base):
    __tablename__ = "PersonExtraInfo"

    id = Column(Integer, unique=True, nullable=False, default=get_random)

    personId = Column(Integer, ForeignKey(Person.id, ondelete="CASCADE", onupdate="CASCADE"),
                      primary_key=True, index=True)

    universityId = Column(Integer, ForeignKey(University.id, ondelete="CASCADE", onupdate="CASCADE"),
                          primary_key=True, index=True)

    enrollmentPeriodId = Column(Integer, ForeignKey(EnrollmentPeriod.id, ondelete="CASCADE", onupdate="CASCADE"),
                                primary_key=True, index=True)

    submittedDiploma = Column(Boolean, unique=False, nullable=False, default=False)

    extraScore = Column(Integer, unique=False, nullable=False, default=0)
    editDate = Column(DateTime, unique=False, nullable=True)
    creationDate = Column(DateTime, unique=False, nullable=False, default=datetime.now())
