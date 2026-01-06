from sqlalchemy import create_engine
from app.core.database import Base
from app.models.appointment import Appointment
from app.models.service import Service
from app.core.database import SessionLocal

db = SessionLocal()

def drop_appointments_table(engine):
    try:
        Appointment.__table__.drop_all(db.bind, checkfirst=True)
        print("Tabela 'appointments' removida com sucesso.")
    except Exception as e:
        print(f"Erro ao remover a tabela 'appointments': {e}")