from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session
from api.dto.legacy.competition_type_old_dto import CompetitionTypeOldDTO
from api.routers.get_session import get_session
from db.models.application_info import ApplicationInfo
from db.models.competition_type import CompetitionType
from db.models.educational_program import EducationalProgram
from db.models.field_of_study import FieldOfStudy
from db.models.study_mode import StudyMode
from db.models.university import University
from db.models.university_program import UniversityProgram
from db.models.university_with_field_of_study import UniversityWithFieldOfStudy

competition_type_old_router = APIRouter()


@competition_type_old_router.get("/", response_model=List[CompetitionTypeOldDTO])
def get_all_directions(db_session: Session = Depends(get_session)) -> list[CompetitionTypeOldDTO]:
    query = select(CompetitionType.id, CompetitionType.type, StudyMode.id, EducationalProgram.id, FieldOfStudy.id, University.id)\
        .select_from(ApplicationInfo)\
        .join(UniversityProgram).join(CompetitionType).join(StudyMode).join(UniversityWithFieldOfStudy).join(EducationalProgram).join(FieldOfStudy).join(University)

    query_row = db_session.execute(query)
    rows = query_row.fetchall()

    return [CompetitionTypeOldDTO(type_id=row[0], type_name=row[1], study_mode_id=row[2], program_id=row[3], university_id=row[5], direction_id=row[4]) for row in rows]