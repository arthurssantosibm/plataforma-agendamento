from sqlalchemy import Column, Integer, Time
from app.core.database import Base

class WorkingHour(Base):
    __tablename__ = "working_hours"

    id = Column(Integer, primary_key=True)
    weekday = Column(Integer, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
