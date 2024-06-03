from sqlalchemy import Column, Integer, String
from db.base import Base
from utils.helpers import get_random


class SpecialRight(Base):
    __tablename__ = "SpecialRight"

    id = Column(Integer, primary_key=True, index=True, default=get_random)
    specialRightName = Column(String, unique=True, nullable=False)
