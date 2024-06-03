from fastapi import APIRouter
from api.controllers.admission_prediction_controller import evaluate_probability
from api.models.admission_prediction_dto import AdmissionPredictionDTO

admission_prediction_router = APIRouter()


@admission_prediction_router.post("/evaluate_probability")
def get_probability(dto: AdmissionPredictionDTO) -> float | None:
    return evaluate_probability(dto)
