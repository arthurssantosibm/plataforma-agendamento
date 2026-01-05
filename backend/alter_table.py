from sqlalchemy import create_engine
from app.models.appointment import Appointment
from app.models.appointment_service import AppointmentService
from app.models.user import User
from app.models.address import Address
from app.models.notification import Notification

DATABASE_URL = "postgresql://postgres:1701076288@database.cc1kujauuftf.us-east-1.rds.amazonaws.com:5432/postgres" 
engine = create_engine(DATABASE_URL)

def drop_appointments_table(engine):
    try:
        Notification.__table__.drop(engine, checkfirst=True)
        print("Tabela 'notification' removida com sucesso.")
        
        User.__table__.drop(engine, checkfirst=True)
        print("Tabela 'user' removida com sucesso.")
        
        AppointmentService.__table__.drop(engine, checkfirst=True)
        print("Tabela 'appointment_services' removida com sucesso")
        
        Appointment.__table__.drop(engine, checkfirst=True)
        print("Tabela 'appointments' removida com sucesso")
    except Exception as e:
        print(f"Erro ao remover a tabela 'user': {e}")
        
if __name__ == "__main__":
    print(f"Tentando conectar e remover a tabela 'user' no DB: {engine.url.host}")
    drop_appointments_table(engine)