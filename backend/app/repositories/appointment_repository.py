from sqlalchemy.orm import Session
from datetime import timedelta

from app.models.appointment import Appointment
from app.models.appointment_service import AppointmentService
from app.models.service import Service
from app.schemas.appointment import AppointmentCreate

def create_appointment(db: Session, data: AppointmentCreate):
    services = db.query(Service).filter(Service.id.in_(data.service_ids)).all()

    if len(services) != len(data.service_ids):
        raise ValueError("Um ou mais serviços são inválidos")

    total_duration = sum(
        s.duration_minutes + s.buffer_minutes for s in services
    )

    start = data.start_datetime
    end = start + timedelta(minutes=total_duration)

    appointment = Appointment(
        client_id=data.client_id,
        start_datetime=start,
        end_datetime=end
    )

    db.add(appointment)
    db.flush()  # pega o appointment.id

    for service in services:
        db.add(
            AppointmentService(
                appointment_id=appointment.id,
                service_id=service.id
            )
        )

    db.commit()
    db.refresh(appointment)
    return appointment

def get_appointments(db: Session):
    return db.query(Appointment).all()
