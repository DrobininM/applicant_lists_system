from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import settings


Engine = create_engine(settings.DB_POSTGRES_URL, echo=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, expire_on_commit=False, bind=Engine)

Base = declarative_base()
