from sqlalchemy import Column, Integer, ForeignKey, DateTime
from db.base import Base
from datetime import datetime
from db.models.application_info import ApplicationInfo
from db.models.enrollment_period import EnrollmentPeriod
from utils.helpers import get_random


class Application(Base):
    __tablename__ = "Application"

    id = Column(Integer, unique=True, nullable=False, index=True, default=get_random)

    applicationInfoId = Column(Integer, ForeignKey(ApplicationInfo.id, ondelete="CASCADE", onupdate="CASCADE"),
                               primary_key=True, index=True)

    enrollmentPeriodId = Column(Integer, ForeignKey(EnrollmentPeriod.id, ondelete="CASCADE", onupdate="CASCADE"),
                                primary_key=True, index=True)

    budgetSeatNumber = Column(Integer, unique=False, nullable=False, default=0)
    commercialSeatNumber = Column(Integer, unique=False, nullable=False, default=0)
    targetedSeatNumber = Column(Integer, unique=False, nullable=False, default=0)
    creationDate = Column(DateTime, unique=False, nullable=False, default=datetime.now())
