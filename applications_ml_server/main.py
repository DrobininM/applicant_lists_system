import uvicorn
from fastapi import APIRouter, FastAPI
from starlette.middleware.cors import CORSMiddleware
from api.routers.admission_prediction_router import admission_prediction_router

main_router = APIRouter()
main_router.include_router(admission_prediction_router, prefix="/ml", tags=["ml"])

app = FastAPI(title="Applicant Lists",
              summary="Applicant Lists API",
              description="API to access applicant lists info")

app.include_router(main_router)

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)
