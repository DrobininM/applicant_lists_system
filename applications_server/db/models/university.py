from sqlalchemy import Column, Integer, String, ForeignKey
from db.base import Base
from db.models.city import City
from utils.helpers import get_random


class University(Base):
    __tablename__ = "University"

    id = Column(Integer, primary_key=True, unique=True, nullable=False, default=get_random)
    universityName = Column(String, unique=False, nullable=False)

    cityId = Column(Integer, ForeignKey(City.id, ondelete="CASCADE", onupdate="CASCADE"),
                    primary_key=True, index=True)
