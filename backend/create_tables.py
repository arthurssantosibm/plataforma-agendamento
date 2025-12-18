from app.core.database import engine, Base
import app.models

def create_tables():
    Base.metadata.create_all(bind=engine)
    print("Todas as tabelas foram criadas corretamente!")

if __name__ == "__main__":
    create_tables()
