from sqlalchemy import Column, Integer, String
from db.base import Base
from utils.helpers import get_random


class City(Base):
    __tablename__ = "City"

    id = Column(Integer, primary_key=True, index=True, default=get_random)
    cityName = Column(String, unique=True, nullable=False)
