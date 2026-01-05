from sqlalchemy import Column, Integer, DateTime, String
from datetime import datetime
from app.core.database import Base

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True)
    service = Column(String(100), nullable=False)
    client_email = Column(String(100), nullable=False)
    time = Column(String(20), default="scheduled")
    created_at = Column(DateTime, default=datetime.utcnow)