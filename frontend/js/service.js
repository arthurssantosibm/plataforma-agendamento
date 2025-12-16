const API_URL = "http://localhost:8000";

async function getServices() {
    const response = await fetch(`${API_URL}/services`);
    return response.json();
}

async function addService() {
    const name = document.getElementById("name").value;
    const duration = document.getElementById("duration").value;
    const buffer = document.getElementById("buffer").value;
    const price = document.getElementById("price").value;

    const response = await fetch(`${API_URL}/services`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            duration_minutes: Number(duration),
            buffer_minutes: Number(buffer),
            price: Number(price)
        })
    });

    if (!response.ok) {
        alert("Erro ao salvar serviço");
        return;
    }

    loadServices();
}

async function loadServices() {
    const services = await getServices();
    const list = document.getElementById("services-list");

    list.innerHTML = "";

    services.forEach(s => {
        const li = document.createElement("li");
        li.innerText = `${s.name} - ${s.duration_minutes} min - R$ ${s.price}`;
        list.appendChild(li);
    });
}

document.addEventListener("DOMContentLoaded", loadServices);
