from sqlalchemy import Column, Integer, DateTime, ForeignKey
from db.base import Base
from datetime import datetime
from db.models.enrollment_period import EnrollmentPeriod
from db.models.person import Person
from db.models.special_right import SpecialRight
from utils.helpers import get_random


class PersonSpecialRight(Base):
    __tablename__ = "PersonSpecialRight"

    id = Column(Integer, unique=True, nullable=False, default=get_random)

    personId = Column(Integer, ForeignKey(Person.id, ondelete="CASCADE", onupdate="CASCADE"),
                      primary_key=True, index=True)

    specialRightId = Column(Integer, ForeignKey(SpecialRight.id, ondelete="CASCADE", onupdate="CASCADE"),
                            primary_key=True, index=True)

    enrollmentPeriodId = Column(Integer, ForeignKey(EnrollmentPeriod.id, ondelete="CASCADE", onupdate="CASCADE"),
                                primary_key=True, index=True)

    creationDate = Column(DateTime, unique=False, nullable=False, default=datetime.now())
