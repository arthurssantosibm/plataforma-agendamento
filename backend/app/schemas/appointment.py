from pydantic import BaseModel, EmailStr
from datetime import datetime
class AppointmentCreate(BaseModel):
    service: str
    client_email: EmailStr
    time: str

class AppointmentResponse(AppointmentCreate):
    service: str
    client_email: EmailStr
    time: str
    
    class Config:
        from_attributes = True