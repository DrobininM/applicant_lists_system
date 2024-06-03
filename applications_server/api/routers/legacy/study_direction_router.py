from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session
from api.dto.legacy.field_of_study_old_dto import FieldOfStudyOldDTO
from api.routers.get_session import get_session
from typing import List
from db.models.field_of_study import FieldOfStudy
from db.models.university import University
from db.models.university_with_field_of_study import UniversityWithFieldOfStudy

study_direction_router = APIRouter()


@study_direction_router.get("/", response_model=List[FieldOfStudyOldDTO])
def get_all_directions(db_session: Session = Depends(get_session)) -> list[FieldOfStudyOldDTO]:
    print("\nexecute")
    query = select(FieldOfStudy.id, FieldOfStudy.fieldOfStudyName, University.id).select_from(UniversityWithFieldOfStudy).join(FieldOfStudy).join(University)

    query_row = db_session.execute(query)
    rows = query_row.fetchall()

    return [FieldOfStudyOldDTO(direction_id=row[0], direction_name=row[1], university_id=row[2]) for row in rows]
