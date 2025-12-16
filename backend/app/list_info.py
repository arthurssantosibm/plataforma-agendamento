from app.core.database import SessionLocal
from app.models.service import Service
db = SessionLocal()

Services = db.query(Service).all()

print("📋 Lista de serviços:")
for s in Services:
    print(
        f"ID: {s.id} | Nome: {s.name} | Duração: {s.duration_minutes} min | Buffer: {s.buffer_minutes} min | Preço: R$ {s.price}"
    )

db.close()
