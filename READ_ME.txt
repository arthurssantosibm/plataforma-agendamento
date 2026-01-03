Para criar o ambiente virtual:

1. montar a estrutura de pastas correta -->

├── main.py
├── .env (com os dados de conexao do banco na raiz do )
│
├── app/
│   ├── __init__.py
│
│   ├── core/
│   │   ├── __init__.py
│   │   └── database.py
│
│   ├── models/
│   │   ├── __init__.py
│   │   └── service.py
│
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── service.py
│
│   ├── repositories/
│   │   ├── __init__.py
│   │   └── service_repository.py
│
│   ├── api/
│   │   ├── __init__.py
│   │   └── service_routes.py


2. instalar dependencias:
pip install fastapi uvicorn sqlalchemy psycopg2-binary python-dotenv passlib[bcrypt]

3. rodar esse codigo no terminal raiz: 
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

4. entrar na pasta backend e ativar o ambiente virtual:
venv/Scripts/activate

5. verificar se o main.py está na pasta app

6. rodar a api:
uvicorn app.main:app --reload