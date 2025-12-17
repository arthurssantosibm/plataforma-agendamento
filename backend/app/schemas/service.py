from pydantic import BaseModel
from typing import Optional

class ServiceBase(BaseModel):
    name: str
    duration_minutes: int
    buffer_minutes: int = 0
    price: Optional[float] = None
    active: bool = True

class ServiceCreate(ServiceBase):
    pass

class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    duration_minutes: Optional[int] = None
    buffer_minutes: Optional[int] = None
    price: Optional[float] = None
    active: Optional[bool] = None

class ServiceResponse(ServiceBase):
    id: int

    class Config:
        from_attributes = True
