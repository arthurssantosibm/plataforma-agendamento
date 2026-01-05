from sqlalchemy import create_engine
from app.core.database import Base 

DATABASE_URL = "postgresql://postgres:1701076288@database.cc1kujauuftf.us-east-1.rds.amazonaws.com:5432/postgres" 
engine = create_engine(DATABASE_URL)

def listar_tabelas_do_banco(engine):
    try:
        metadata = Base.metadata 
        print("Refletindo o esquema do banco de dados...")
        metadata.reflect(bind=engine)
        
        print("\nTabelas Encontradas no Banco de Dados:")
        tabelas = metadata.tables.keys()
        
        if tabelas:
            for nome_tabela in sorted(tabelas):
                print(f"* {nome_tabela}")
        else:
            print("Nenhuma tabela encontrada no esquema principal.")
            
    except Exception as e:
        print(f"Ocorreu um erro ao tentar listar as tabelas: {e}")
listar_tabelas_do_banco(engine)