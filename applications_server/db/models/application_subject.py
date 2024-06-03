from sqlalchemy import Column, Integer, ForeignKey
from db.base import Base
from db.models.application import Application
from db.models.subject import Subject
from utils.helpers import get_random


class ApplicationSubject(Base):
    __tablename__ = "ApplicationSubject"

    id = Column(Integer, unique=True, nullable=False, default=get_random)

    applicationId = Column(Integer, ForeignKey(Application.id, ondelete="CASCADE", onupdate="CASCADE"),
                           primary_key=True, index=True)

    subjectId = Column(Integer, ForeignKey(Subject.id, ondelete="CASCADE", onupdate="CASCADE"),
                       primary_key=True, index=True)
