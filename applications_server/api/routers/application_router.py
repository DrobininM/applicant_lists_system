from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from api.controllers import application_controller
from api.dto.application_dto import ApplicationDTO, FilteredApplicationDTO, LastApplicationFullDTO, ApplicationFullDTO
from api.dto.application_dto import LastApplicationDTO
from api.routers.get_session import get_session
from api.utils.helpers import split_data_by_offset
from db.crud.educational_program_crud import EducationalProgramCrud

application_router = APIRouter()


@application_router.get("/application", description="Receive a specific applicant list",
                        response_model=ApplicationDTO)
def get_application(university_id: int, field_of_study_id: int, program_id: int,
                    competition_type_id: int, study_mode_id: int, enrollment_period_id: int,
                    db_session: Session = Depends(get_session)) -> ApplicationDTO | None:
    return application_controller.get_application(university_id, field_of_study_id, program_id,
                                                  competition_type_id, study_mode_id, enrollment_period_id,
                                                  db_session)


@application_router.get("/last_application", description="Receive an application of the recent enrollment period",
                        response_model=LastApplicationDTO)
def get_last_application(university_id: int, field_of_study_id: int, program_id: int,
                         competition_type_id: int, study_mode_id: int,
                         db_session: Session = Depends(get_session)) -> LastApplicationDTO | None:
    return application_controller.get_last_application(university_id, field_of_study_id, program_id,
                                                       competition_type_id, study_mode_id, db_session)


@application_router.get("/full_last_application", response_model=LastApplicationFullDTO)
def get_last_application_full(university_id: int, field_of_study_id: int, program_id: int,
                              competition_type_id: int, study_mode_id: int,
                              db_session: Session = Depends(get_session)) -> LastApplicationFullDTO | None:
    return application_controller.get_full_last_application(university_id, field_of_study_id, program_id,
                                                            competition_type_id, study_mode_id, db_session)


@application_router.get("/full_application", response_model=ApplicationFullDTO)
def get_application_full(university_id: int, field_of_study_id: int, program_id: int,
                         competition_type_id: int, study_mode_id: int, enrollment_period_id: int,
                         db_session: Session = Depends(get_session)) -> ApplicationFullDTO | None:
    return application_controller.get_full_application(university_id, field_of_study_id, program_id,
                                                       enrollment_period_id, competition_type_id, study_mode_id,
                                                       db_session)


@application_router.get("/", response_model=List[ApplicationDTO])
def get_applications(university_id: Optional[int] = None, field_of_study_id: Optional[int] = None,
                     program_id: Optional[int] = None, enrollment_period_id: Optional[int] = None,
                     db_session: Session = Depends(get_session)) -> list[ApplicationDTO] | None:
    return application_controller.get_applications(university_id, field_of_study_id, program_id, enrollment_period_id,
                                                   db_session)


@application_router.get("/get_applications_by_filter", response_model=FilteredApplicationDTO)
def get_filtered_applications(university_id: Optional[int] = None, field_of_study_id: Optional[int] = None,
                              enrollment_period_id: Optional[int] = None, program_name: str | None = None,
                              offset: int = 0, count: int = 20, db_session: Session = Depends(get_session))\
        -> FilteredApplicationDTO | None:
    applications = application_controller.get_applications(university_id, field_of_study_id, None, enrollment_period_id,
                                                           db_session)

    if applications is None:
        return None

    if program_name is None:
        applications, total_count = split_data_by_offset(applications, offset, count)
    else:
        programs_crud = EducationalProgramCrud(db_session)
        program_id_list = [application.program.program_id for application in applications]
        allowed_program_id_list = [program.id for program in programs_crud.get_programs_by_id(program_id_list)
                                   if program_name.strip() in program.programName]

        applications, total_count =\
            split_data_by_offset(applications, offset, count,
                                 lambda entry: entry.program.program_id in allowed_program_id_list)

    return FilteredApplicationDTO(applications=applications, total_count=total_count)
