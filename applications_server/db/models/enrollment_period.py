from datetime import datetime
from sqlalchemy import Column, Integer, DateTime
from db.base import Base
from utils.helpers import get_random


class EnrollmentPeriod(Base):
    __tablename__ = "EnrollmentPeriod"

    id = Column(Integer, primary_key=True, default=get_random)
    startDate = Column(DateTime, unique=False, nullable=False, default=datetime.now())
    endDate = Column(DateTime, unique=False, nullable=True)
