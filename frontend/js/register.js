const REGISTER_API_URL = "http://127.0.0.1:8000/users/"; 
const registerForm = document.getElementById('register-form');

async function handleRegister(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const phone = document.getElementById('phone').value; 
    const payload = {
        name: name,
        email: email,
        password: password, 
        role: "client",
        phone: phone.trim() === '' ? null : phone, 
    };

    const button = registerForm.querySelector('button');
    button.disabled = true;
    button.textContent = 'Registrando...';

    try {
        const response = await fetch(REGISTER_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert("Cadastro realizado com sucesso! Faça login para continuar.");
            window.location.href = 'login.html'; 
            return;
        }

        let errorMessage = `Falha no Cadastro (Status ${response.status}):\n`;

        try {
            const errorData = await response.json(); 
            
            if (errorData.detail) {
                let details = errorData.detail.map(err => {
                    const loc = err.loc.length > 1 ? err.loc[1] : 'body';
                    return `Campo '${loc}': ${err.msg}`;
                }).join('\n');

                errorMessage += details;
                
            } else if (errorData.message) {
                errorMessage += errorData.message;
            } else {
                errorMessage += JSON.stringify(errorData, null, 2);
            }

        } catch (e) {
            const responseText = await response.text();
            errorMessage += `Erro não JSON. Resposta do servidor:\n${responseText || 'Sem detalhes.'}`;
        }
        
        alert(errorMessage);
        
    } catch (error) {
        console.error("Erro na requisição de cadastro:", error);
        alert("Erro de rede. Verifique a conexão com a API.");
    } finally {
        button.disabled = false;
        button.textContent = 'Cadastrar';
    }
}

registerForm.addEventListener('submit', handleRegister);