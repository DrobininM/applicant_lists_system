from pydantic import BaseModel


class WithConfig(BaseModel):
    class Config:
        """tells pydantic to convert even non dict obj to json"""
        orm_mode = True
