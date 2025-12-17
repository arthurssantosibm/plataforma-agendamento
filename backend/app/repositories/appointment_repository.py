from sqlalchemy.orm import Session
from app.models.appointment import Appointment
from app.schemas.appointment import AppointmentCreate

def create_appointment(db: Session, data: AppointmentCreate):
    appointment = Appointment(**data.dict())
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    return appointment

def get_appointments(db: Session):
    return db.query(Appointment).all()

def get_appointments_by_service(db: Session, service_id: int):
    return db.query(Appointment).filter(
        Appointment.service_id == service_id
    ).all()
