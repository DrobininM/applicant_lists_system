from sqlalchemy.orm import Session
from api.dto.study_mode_dto import StudyModeDTO
from db.crud.application_info_crud import ApplicationInfoCrud
from db.crud.study_mode_crud import StudyModeCrud


def get_all_study_modes(db_session: Session) -> list[StudyModeDTO]:
    crud = StudyModeCrud(db_session)
    study_modes = crud.get_all_study_modes()

    return [StudyModeDTO(study_mode_id=mode.id, study_mode_name=mode.mode) for mode in study_modes]


def get_program_study_modes(university_id: int, field_of_study_id: int, program_id: int, db_session: Session)\
        -> list[StudyModeDTO] | None:
    crud = ApplicationInfoCrud(db_session)
    study_modes = crud.get_program_study_modes(university_id, field_of_study_id, program_id)

    if study_modes is None:
        return None

    return [StudyModeDTO(study_mode_id=study_mode.id, study_mode_name=study_mode.mode) for study_mode in study_modes]
