from datetime import datetime
from sqlalchemy import Integer, Column, ForeignKey, String, DateTime
from db.base import Base
from db.models.application import Application
from utils.helpers import get_random


class ActualApplication(Base):
    __tablename__ = "ActualApplication"

    id = Column(Integer, unique=True, nullable=False, default=get_random)

    applicationId = Column(Integer, ForeignKey(Application.id, ondelete="CASCADE", onupdate="CASCADE"),
                           primary_key=True, index=True)

    applicationLink = Column(String, unique=True, nullable=False)
    lastCheckDate = Column(DateTime, unique=False, nullable=True)
    creationDate = Column(DateTime, unique=False, nullable=False, default=datetime.now())
