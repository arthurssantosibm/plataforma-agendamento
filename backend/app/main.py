from fastapi import FastAPI
from fastapi.responses import HTMLResponse

app = FastAPI()

@app.get("/")
def index():
    return HTMLResponse("""
    <!DOCTYPE html>
    <html>
    <head><title>Teste API</title></head>
    <body>
    <h1>Teste de Conexão</h1>
    <button onclick="testAPI()">Testar API</button>
    <pre id="result"></pre>
    <script>
    async function testAPI() {
        try {
            const res = await fetch('/health');
            const data = await res.json();
            document.getElementById('result').innerText = JSON.stringify(data, null, 2);
        } catch(e) {
            document.getElementById('result').innerText = e;
        }
    }
    </script>
    </body>
    </html>
    """)

@app.get("/health")
def health():
    return {"status": "ok", "message": "API funcionando!"}
