const LOGIN_API_URL = "http://127.0.0.1:8000/users"; 
const loginForm = document.getElementById('login-form');
const NEXT_PAGE = 'agendamento.html'; // Página para onde redirecionar após o login

/**
 * Lida com o envio do formulário de login e salva o token de autenticação.
 */
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
            // --- O SUCESSO DO LOGIN DEPENDE DA SUA API: ---
            
            // 1. Armazenar o Token (Chave de Autenticação)
            const token = data.access_token; 
            if (token) {
                // SALVA O TOKEN NO LOCAL STORAGE (ou Cookies, se preferir)
                localStorage.setItem('authToken', token);
                
                // Opcional: Armazenar o ID ou nome do usuário
                localStorage.setItem('userId', data.user_id); 
                
                alert("Login realizado com sucesso!");
                window.location.href = 'index.html'
            } else {
                throw new Error("Sucesso no login, mas token não recebido.");
            }
            // ------------------------------------------------
            
        } else {
            // Erro de credenciais inválidas ou usuário não encontrado
            alert(`Falha no Login: ${data.detail || 'Email ou senha incorretos'}`);
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