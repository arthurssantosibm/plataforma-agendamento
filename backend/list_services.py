from app.core.database import SessionLocal
from app.models.service import Service

def list_services():
    db = SessionLocal()
    try:
        services = db.query(Service).all()

        if not services:
            print("📭 Nenhum serviço encontrado.")
            return

        print("\nSERVIÇOS CADASTRADOS:")
        for s in services:
            print("-" * 40)
            print(f"ID: {s.id}")
            print(f"Nome: {s.name}")
            print(f"Duração: {s.duration_minutes} min")
            print(f"Buffer: {s.buffer_minutes} min")
            print(f"Preço: R$ {s.price}")
            print(f"Ativo: {s.active}")
    finally:
        db.close()

if __name__ == "__main__":
    list_services()
