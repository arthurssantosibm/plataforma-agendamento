from sqlalchemy import Column, Integer, String, Boolean, Float
from sqlalchemy.orm import relationship
from app.core.database import Base

class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    duration_minutes = Column(Integer, nullable=False)
    buffer_minutes = Column(Integer, default=0)
    price = Column(Float)
    active = Column(Boolean, default=True)

    appointments = relationship("AppointmentService", back_populates="service")
