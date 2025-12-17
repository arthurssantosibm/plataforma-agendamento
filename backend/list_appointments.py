from app.core.database import SessionLocal
from app.models.appointment import Appointment

db = SessionLocal()
appointments = db.query(Appointment).all()

for a in appointments:
    print("ID:", a.id)
    print("Cliente:", a.client_id)
    print("Início:", a.start_datetime)
    print("Fim:", a.end_datetime)
    print("Status:", a.status)
    print("Serviços:", [s.service_id for s in a.services])
    print("-" * 40)

db.close()
