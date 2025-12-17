from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.schemas.appointment import AppointmentCreate, AppointmentResponse
from app.repositories.appointment_repository import (
    create_appointment,
    get_appointments,
)

router = APIRouter(prefix="/appointments", tags=["Appointments"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=AppointmentResponse)
def create(data: AppointmentCreate, db: Session = Depends(get_db)):
    return create_appointment(db, data)

@router.get("/", response_model=list[AppointmentResponse])
def list_all(db: Session = Depends(get_db)):
    return get_appointments(db)
