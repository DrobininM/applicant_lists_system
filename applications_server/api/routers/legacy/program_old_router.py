from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session
from api.dto.legacy.program_old_dto import ProgramOldDTO
from api.routers.get_session import get_session
from db.models.educational_program import EducationalProgram
from db.models.field_of_study import FieldOfStudy
from db.models.university import University
from db.models.university_program import UniversityProgram
from db.models.university_with_field_of_study import UniversityWithFieldOfStudy

program_old_router = APIRouter()


@program_old_router.get("/", response_model=List[ProgramOldDTO])
def get_all_directions(db_session: Session = Depends(get_session)) -> list[ProgramOldDTO]:
    query = select(EducationalProgram.id, EducationalProgram.programName, FieldOfStudy.id, University.id)\
        .select_from(UniversityProgram)\
        .join(UniversityWithFieldOfStudy).join(EducationalProgram).join(FieldOfStudy).join(University)

    query_row = db_session.execute(query)
    rows = query_row.fetchall()

    return [ProgramOldDTO(program_id=row[0], program_name=row[1], university_id=row[3], direction_id=row[2]) for row in rows]