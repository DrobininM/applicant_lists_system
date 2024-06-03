from sqlalchemy.orm import Session
from api.dto.educational_program_dto import EducationalProgramDTO
from db.crud.educational_program_crud import EducationalProgramCrud
from db.crud.university_program_crud import UniversityProgramCrud


def get_programs(university_id: int | None, field_of_study_id: int | None, db_session: Session)\
        -> list[EducationalProgramDTO] | None:
    if university_id is None and field_of_study_id is None:
        crud = EducationalProgramCrud(db_session)
        programs = crud.get_all_programs()

        return [
            EducationalProgramDTO(program_id=program.id, program_name=program.programName)
            for program in programs
        ]

    crud = UniversityProgramCrud(db_session)

    if university_id is not None and field_of_study_id is not None:
        programs = crud.get_programs_by_university_and_field(university_id, field_of_study_id)
    elif university_id is not None:
        programs = crud.get_programs_by_university(university_id)
    else:
        programs = crud.get_programs_by_field_of_study(field_of_study_id)

    return [EducationalProgramDTO(program_id=program.id, program_name=program.programName) for program in programs]
