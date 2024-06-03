from sqlalchemy.orm import Session
from api.dto.competition_type_dto import CompetitionTypeDTO
from db.crud.application_info_crud import ApplicationInfoCrud
from db.crud.competition_type_crud import CompetitionTypeCrud


def get_all_competition_types(db_session: Session) -> list[CompetitionTypeDTO]:
    crud = CompetitionTypeCrud(db_session)
    types = crud.get_all_competition_types()

    return [
        CompetitionTypeDTO(
            competition_type_id=competition_type.id,
            competition_type_name=competition_type.type)
        for competition_type in types
    ]


def get_program_competition_types(university_id: int, field_of_study_id: int, program_id: int, study_mode_id: int,
                                  db_session: Session) -> list[CompetitionTypeDTO] | None:
    crud = ApplicationInfoCrud(db_session)
    types = crud.get_program_competition_types(university_id, field_of_study_id, program_id, study_mode_id)

    if types is None:
        return None

    return [
        CompetitionTypeDTO(
            competition_type_id=competition_type.id,
            competition_type_name=competition_type.type)
        for competition_type in types
    ]
