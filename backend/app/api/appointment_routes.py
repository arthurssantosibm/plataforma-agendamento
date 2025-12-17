from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.schemas.appointment import AppointmentCreate, AppointmentResponse
from app.repositories.appointment_repository import (
    create_appointment,
    get_appointments
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
    try:
        appointment = create_appointment(db, data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return AppointmentResponse(
        id=appointment.id,
        client_id=appointment.client_id,
        start_datetime=appointment.start_datetime,
        end_datetime=appointment.end_datetime,
        status=appointment.status,
        created_at=appointment.created_at,
        service_ids=[s.service_id for s in appointment.services]
    )


@router.get("/", response_model=list[AppointmentResponse])
def list_all(db: Session = Depends(get_db)):
    appointments = get_appointments(db)

    return [
        AppointmentResponse(
            id=a.id,
            client_id=a.client_id,
            start_datetime=a.start_datetime,
            end_datetime=a.end_datetime,
            status=a.status,
            created_at=a.created_at,
            service_ids=[s.service_id for s in a.services]
        )
        for a in appointments
    ]
