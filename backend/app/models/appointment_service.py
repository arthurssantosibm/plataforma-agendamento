from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class AppointmentService(Base):
    __tablename__ = "appointment_services"

    id = Column(Integer, primary_key=True)
    appointment_id = Column(Integer, ForeignKey("appointments.id"), nullable=False)
    service_id = Column(Integer, ForeignKey("services.id"), nullable=False)

    appointment = relationship("Appointment", back_populates="services")
    service = relationship("Service", back_populates="appointments")
