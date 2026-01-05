from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from app.core.database import SessionLocal 
from app.models.appointment import Appointment
from app.schemas.appointment import AppointmentCreate, AppointmentResponse

router = APIRouter(
    prefix="/appointments",
    tags=["Agendamentos"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=AppointmentResponse, status_code=status.HTTP_201_CREATED)
def create_appointment(
    appointment_data: AppointmentCreate, 
    db: Session = Depends(get_db)
):
    new_appointment = Appointment(
        service=appointment_data.service,
        client_email=appointment_data.client_email,
        time=appointment_data.time,
        status="scheduled"
    )
    try:
        db.add(new_appointment)
        db.commit()
        db.refresh(new_appointment)
        return new_appointment
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Não foi possível salvar o agendamento no banco de dados."
        )

@router.get("/", response_model=list[AppointmentResponse])
def read_appointments(db: Session = Depends(get_db)):
    appointments = db.query(Appointment).all()
    return appointments