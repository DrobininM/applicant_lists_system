from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session
from api.dto.legacy.study_mode_old_dto import StudyModeOldDTO
from api.routers.get_session import get_session
from db.models.application_info import ApplicationInfo
from db.models.educational_program import EducationalProgram
from db.models.field_of_study import FieldOfStudy
from db.models.study_mode import StudyMode
from db.models.university import University
from db.models.university_program import UniversityProgram
from db.models.university_with_field_of_study import UniversityWithFieldOfStudy

study_mode_old_router = APIRouter()


@study_mode_old_router.get("/", response_model=List[StudyModeOldDTO])
def get_all_study_modes(db_session: Session = Depends(get_session)) -> list[StudyModeOldDTO]:
    query = select(StudyMode.id, StudyMode.mode, EducationalProgram.id, FieldOfStudy.id, University.id)\
        .select_from(ApplicationInfo)\
        .join(UniversityProgram).join(StudyMode).join(UniversityWithFieldOfStudy).join(EducationalProgram).join(FieldOfStudy).join(University)

    query_row = db_session.execute(query)
    rows = query_row.fetchall()

    return [StudyModeOldDTO(mode_id=row[0], mode_name=row[1], program_id=row[2], university_id=row[4], direction_id=row[3]) for row in rows]