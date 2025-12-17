from pydantic import BaseModel
from typing import Optional

class ServiceBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float

class ServiceCreate(ServiceBase):
    pass

class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None

class ServiceResponse(ServiceBase):
    id: int

    class Config:
        from_attributes = True
