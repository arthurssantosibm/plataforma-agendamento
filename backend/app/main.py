from fastapi import FastAPI

app = FastAPI(title="Plataforma de Agendamento")

@app.get("/")
def root():
    return {"status": "API rodando com sucesso"}
