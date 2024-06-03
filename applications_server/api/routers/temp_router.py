from fastapi import APIRouter
from pydantic import BaseModel

temp_router = APIRouter()


class Resp(BaseModel):
    numbers: list[int]
    all_count: int


data = [i for i in range(500)]


@temp_router.get("/", response_model=Resp)
def get_all_study_modes(offset: int = 0, count: int = 30, filter: int = None) -> Resp:
    if offset >= len(data):
        return Resp(numbers=[0], all_count=len(data))

    end_index = offset + count

    selected_data = data

    if filter is not None:
        selected_data = [number for number in selected_data if str(filter) in str(number)]
        print(selected_data)

    if end_index > len(selected_data):
        end_index = len(selected_data)

    return Resp(numbers=selected_data[offset:end_index], all_count=len(selected_data))
