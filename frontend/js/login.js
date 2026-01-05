const LOGIN_API_URL = "http://127.0.0.1:8000/users/login/"; 
const loginForm = document.getElementById('login-form');
const NEXT_PAGE = 'index.html';

async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const payload = {
        email: email, 
        password: password
    };

    const button = loginForm.querySelector('button');
    button.disabled = true;
    button.textContent = 'Entrando...';

    try {
        const response = await fetch(LOGIN_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            if (data.id) {
                localStorage.setItem('userId', data.id); 
                alert("Login realizado com sucesso!");
                window.location.href = NEXT_PAGE; 
            } else {
                throw new Error("Sucesso no login, mas dados de usuário incompletos.");
            }
        } else {
            alert(`Falha no Login: ${data.detail || 'Erro desconhecido.'}`);
        }

    } catch (error) {
        console.error("Erro na requisição de login:", error);
        alert(`Erro de rede ou na API: ${error.message}`);
    } finally {
        button.disabled = false;
        button.textContent = 'Entrar';
    }
}

loginForm.addEventListener('submit', handleLogin);