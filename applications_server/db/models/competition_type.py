from sqlalchemy import Column, Integer, String
from db.base import Base
from utils.helpers import get_random


class CompetitionType(Base):
    __tablename__ = "CompetitionType"

    id = Column(Integer, primary_key=True, index=True, default=get_random)
    type = Column(String, unique=True, nullable=False)
