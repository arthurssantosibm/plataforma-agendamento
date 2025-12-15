from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class AppointmentService(Base):
    __tablename__ = "appointments_services"

    id = Column(Integer, primary_key=True)
    appointment_id = Column(Integer, ForeignKey("appointments.id"))
    service_id = Column(Integer, ForeignKey("services.id"))

    appointment = relationship("Appointment", back_populates="services")
    service = relationship("Service", back_populates="appointments")
