from threading import Thread
import uvicorn
from fastapi import FastAPI, Request, Response
from fastapi.routing import APIRouter
from api.routers.applicant_file_router import applicant_file_router
from api.routers.city_router import city_router
from api.routers.enrollment_period_router import enrollment_period_router
from api.routers.legacy.competition_type_old_router import competition_type_old_router
from api.routers.legacy.study_direction_router import study_direction_router
from api.routers.legacy.study_mode_old_router import study_mode_old_router
from api.routers.temp_router import temp_router
from db.create_db_script import try_create_tables, try_create_db
from db.mongo.application_schema_crud import ApplicationSchemaCrud
from db.mongo.base import client, mongo_db, mongo_collection
from api.routers.legacy.program_old_router import program_old_router
from fastapi.middleware.cors import CORSMiddleware
import settings
from api.routers.application_router import application_router
from api.routers.university_router import university_router
from api.routers.field_of_study_router import field_of_study_router
from api.routers.educational_program_router import educational_program_router
from api.routers.competition_type_router import competition_type_router
from api.routers.study_mode_router import study_mode_router
from db.base import SessionLocal
from parsing.scrapper import start_scrapping
from utils.mock_db_data import fill_with_mock_data

main_router = APIRouter()
main_router.include_router(city_router, prefix="/cities", tags=["cities"])
main_router.include_router(application_router, prefix="/applications", tags=["application"])
main_router.include_router(university_router, prefix="/universities", tags=["universities"])
main_router.include_router(field_of_study_router, prefix="/fields_of_study", tags=["fields_of_study"])
main_router.include_router(educational_program_router, prefix="/programs", tags=["educational_programs"])
main_router.include_router(competition_type_router, prefix="/competition_types", tags=["competition_types"])
main_router.include_router(study_mode_router, prefix="/study_modes", tags=["study_modes"])
main_router.include_router(enrollment_period_router, prefix="/enrollment_periods", tags=["enrollment_periods"])
main_router.include_router(applicant_file_router, prefix="/applicant_files", tags=["application_schema"])

app = FastAPI(title="Applicant Lists",
              summary="Applicant Lists API",
              description="API to access applicant lists info")

main_router.include_router(temp_router, prefix="/test", tags=["test"])
main_router.include_router(study_direction_router, prefix="/study_directions")
main_router.include_router(program_old_router, prefix="/educational_programs_old")
main_router.include_router(study_mode_old_router, prefix="/study_modes_old")
main_router.include_router(competition_type_old_router, prefix="/competition_types_old")

app.include_router(main_router)

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def db_session_middleware(request: Request, call_next):
    response = Response("Internal server error", status_code=500)
    try:
        request.state.db = SessionLocal()
        response = await call_next(request)
    finally:
        request.state.db.close()

    return response


if __name__ == "__main__":
    #try_create_db()
    try_create_tables()
    #fill_with_mock_data()
    thread = Thread(target=start_scrapping)
    thread.start()
    uvicorn.run(app, host="0.0.0.0", port=settings.PORT)
    thread.join()
