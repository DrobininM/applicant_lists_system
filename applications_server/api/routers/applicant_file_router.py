from typing import Optional

from fastapi import APIRouter, Depends, UploadFile
from sqlalchemy.orm import Session
from api.controllers.applicant_file_controller import process_new_file, create_new_applicant_list, \
    get_saved_applicant_list_schema
from api.controllers import applicant_file_controller
from api.dto.application_file_dto import ApplicationFileDTO
from api.dto.application_schema_dto import ApplicationSchemaDTO
from api.routers.get_session import get_session
from api.controllers import application_check_controller
from api.dto.with_config import WithConfig

applicant_file_router = APIRouter()


class ApplicationSchemaWrapperDTO(WithConfig):
    application_schema: ApplicationSchemaDTO


@applicant_file_router.post("/get_processed_file", response_model=ApplicationFileDTO)
def get_processed_file(file: UploadFile, db_session: Session = Depends(get_session)) -> ApplicationFileDTO:
    return process_new_file(file, db_session)


@applicant_file_router.post("/add_applicant_list_info")
def add_new_applicant_list(application_schema: ApplicationSchemaWrapperDTO, db_session: Session = Depends(get_session))\
        -> bool:
    try:
        create_new_applicant_list(application_schema.application_schema, False, db_session)
    except Exception as e:
        print(e)
        return False

    return True


@applicant_file_router.post("/edit_applicant_list_info")
def edit_new_applicant_list(application_schema: ApplicationSchemaWrapperDTO,
                            db_session: Session = Depends(get_session)) -> bool:
    try:
        create_new_applicant_list(application_schema.application_schema, True, db_session)
    except:
        return False

    return True


@applicant_file_router.get("/get_applicant_list_info", response_model=Optional[ApplicationSchemaDTO])
def get_saved_applicant_list(application_id: int, db_session: Session = Depends(get_session))\
        -> ApplicationSchemaDTO | None:
    return get_saved_applicant_list_schema(application_id, db_session)


@applicant_file_router.get("/check_can_process_file",
                           description="Check if an applicant list can be downloaded from the url and processed")
def check_can_process_file(url: str) -> bool:
    return application_check_controller.check_can_process_file(url)


@applicant_file_router.delete("/remove_applicant_list")
def remove_applicant_list(application_id: int, db_session: Session = Depends(get_session)) -> bool:
    applicant_file_controller.remove_applicant_list(application_id, db_session)

    return True
