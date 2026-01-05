from app.core.database import engine, Base
from app.models.appointment import Appointment

def create_appointment_table():
    try:
        Appointment.__table__.create(bind=engine, checkfirst=True)
        print("Tabela 'appointments' criada com sucesso.")
    except Exception as e:
        print(f"Erro ao criar a tabela 'appointments': {e}")

if __name__ == "__main__":
    create_appointment_table()
