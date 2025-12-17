from pydantic import BaseModel
from datetime import datetime

class AppointmentCreate(BaseModel):
    service_id: int
    customer_name: str
    appointment_datetime: datetime

class AppointmentResponse(AppointmentCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
