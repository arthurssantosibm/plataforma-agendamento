from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class AppointmentCreate(BaseModel):
    client_id: int
    start_datetime: datetime
    service_ids: List[int]

class AppointmentResponse(BaseModel):
    id: int
    client_id: int
    start_datetime: datetime
    end_datetime: datetime
    status: str
    created_at: datetime
    service_ids: List[int]

    class Config:
        from_attributes = True
