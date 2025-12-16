const API_URL = "http://localhost:8000/users";

document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        phone: document.getElementById("phone").value,
        role: "client"
    };

    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
    });

    const result = await response.json();
    const msg = document.getElementById("msg");

    if (response.ok) {
        msg.style.color = "green";
        msg.innerText = "Cadastro realizado com sucesso!";
        document.getElementById("registerForm").reset();
    } else {
        msg.style.color = "red";
        msg.innerText = result.detail || "Erro ao cadastrar";
    }
});
