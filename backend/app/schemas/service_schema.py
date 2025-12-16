from pydantic import BaseModel

class ServiceCreate(BaseModel):
    name: str
    duration_minutes: int
    buffer_minutes: int = 0
    price: float


class ServiceResponse(BaseModel):
    id: int
    name: str
    duration_minutes: int
    buffer_minutes: int
    price: float
    active: bool

    class Config:
        from_attributes = True
