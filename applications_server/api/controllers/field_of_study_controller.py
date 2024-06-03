from sqlalchemy.orm import Session
from api.dto.field_of_study_dto import FieldOfStudyDTO
from db.crud.field_of_study_crud import FieldOfStudyCrud
from db.crud.university_with_field_crud import UniversityWithFieldCrud


def get_fields_of_study(university_id: int | None, db_session: Session) -> list[FieldOfStudyDTO] | None:
    crud = FieldOfStudyCrud(db_session)

    if university_id is not None:
        university_field_list = UniversityWithFieldCrud(db_session).get_fields_of_study_of_university(university_id)

        if university_field_list is None:
            return None

        return [FieldOfStudyDTO(field_of_study_id=university_field.fieldOfStudyId,
                                field_of_study_name=crud.get_study_field_by_id(university_field.fieldOfStudyId)
                                .fieldOfStudyName)
                for university_field in university_field_list]

    fields_of_study = crud.get_all_fields_of_study()

    return [
        FieldOfStudyDTO(field_of_study_id=field_of_study.id, field_of_study_name=field_of_study.fieldOfStudyName)
        for field_of_study in fields_of_study
    ]
