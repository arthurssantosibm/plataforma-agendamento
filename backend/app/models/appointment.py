from sqlalchemy import Column, Integer, DateTime, ForeignKey, String
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True)
    client_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    start_datetime = Column(DateTime, nullable=False)
    end_datetime = Column(DateTime, nullable=False)
    status = Column(String(20), default="scheduled")
    created_at = Column(DateTime, default=datetime.utcnow)

    client = relationship("User", back_populates="appointments")

    services = relationship(
        "AppointmentService",
        back_populates="appointment",
        cascade="all, delete-orphan"
    )
