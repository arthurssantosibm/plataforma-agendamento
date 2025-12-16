const API_URL = "http://localhost:8000/services";

let editingServiceId = null;

// 🔹 Carregar serviços ao abrir a página
document.addEventListener("DOMContentLoaded", () => {
    loadServices();
});

// 🔹 Buscar e listar serviços
async function loadServices() {
    const response = await fetch(API_URL);
    const services = await response.json();

    const list = document.getElementById("services-list");
    list.innerHTML = "";

    services.forEach(service => {
        const li = document.createElement("li");

li.innerHTML = `
    <div class="service-info">
        <strong>${service.name}</strong><br>
        ${service.duration_minutes} min |
        Buffer: ${service.buffer_minutes} min |
        R$ ${service.price}
    </div>
`;


        list.appendChild(li);
    });
}

// 🔹 Criar ou atualizar serviço
async function addService() {
    const service = {
        name: document.getElementById("name").value,
        duration_minutes: parseInt(document.getElementById("duration").value),
        buffer_minutes: parseInt(document.getElementById("buffer").value),
        price: parseFloat(document.getElementById("price").value)
    };

    let url = API_URL;
    let method = "POST";

    // Se estiver editando, vira UPDATE
    if (editingServiceId) {
        url = `${API_URL}/${editingServiceId}`;
        method = "PUT";
    }

    await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(service)
    });

    clearForm();
    loadServices();
}

// 🔹 Deletar serviço
async function deleteService(id) {
    if (!confirm("Deseja realmente excluir este serviço?")) return;

    await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    loadServices();
}

// 🔹 Editar serviço
async function editService(id) {
    const response = await fetch(`${API_URL}/${id}`);
    const service = await response.json();

    document.getElementById("name").value = service.name;
    document.getElementById("duration").value = service.duration_minutes;
    document.getElementById("buffer").value = service.buffer_minutes;
    document.getElementById("price").value = service.price;

    editingServiceId = id;
}

// 🔹 Limpar formulário
function clearForm() {
    document.getElementById("name").value = "";
    document.getElementById("duration").value = "";
    document.getElementById("buffer").value = "";
    document.getElementById("price").value = "";

    editingServiceId = null;
}
