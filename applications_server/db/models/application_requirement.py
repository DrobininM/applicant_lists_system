from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from db.base import Base
from utils.helpers import get_random


class ApplicationRequirement(Base):
    __tablename__ = "ApplicationRequirement"

    id = Column(Integer, primary_key=True, default=get_random)
    requirementName = Column(String, unique=True, nullable=False)

    substitutionRequirementId = Column(Integer,
                                       ForeignKey("ApplicationRequirement.id", ondelete="CASCADE", onupdate="CASCADE"),
                                       unique=False, nullable=True)

    isClassificationRequired = Column(Boolean, unique=False, nullable=False, default=False)
