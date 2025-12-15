from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="API de Teste")

# Permitir requisições de qualquer origem (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # para produção, coloque apenas os domínios que você vai usar
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok", "message": "API funcionando!"}
