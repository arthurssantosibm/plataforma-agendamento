const API_URL = "http://127.0.0.1:8000/services/"; 

let currentEditingId = null; 

const saveButton = document.querySelector('.service-form-container button');

function setFormMode(mode, serviceId = null) {
    currentEditingId = serviceId;
    
    if (mode === 'add') {
        saveButton.textContent = 'Salvar';
        saveButton.onclick = addService;
        document.getElementById('name').value = '';
        document.getElementById('duration').value = '';
        document.getElementById('buffer').value = '';
        document.getElementById('price').value = '';
    } else if (mode === 'edit') {
        saveButton.textContent = 'Salvar Edição';
        saveButton.onclick = submitEdit;
    }
}


async function addService() {
    if (currentEditingId !== null) return; 

    const name = document.getElementById('name').value;
    const duration = document.getElementById('duration').value;
    const buffer = document.getElementById('buffer').value;
    const price = document.getElementById('price').value;

    const payload = {
        name: name,
        duration_minutes: Number(duration),
        buffer_minutes: Number(buffer),
        price: Number(price)
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Erro ${response.status}: ${text || "Erro ao criar serviço"}`);
        }

        alert("Serviço cadastrado com sucesso!");
        setFormMode('add');
        loadServices();

    } catch (error) {
        console.error("Erro na função addService:", error);
        alert(error.message);
    }
}

async function editService(serviceId) {
    try {
        const response = await fetch(`${API_URL}${serviceId}`); 
        
        if (!response.ok) {
            throw new Error(`Falha ao buscar detalhes do serviço ID ${serviceId}.`);
        }
        
        const service = await response.json();
        document.getElementById('name').value = service.name;
        document.getElementById('duration').value = service.duration_minutes;
        document.getElementById('buffer').value = service.buffer_minutes;
        document.getElementById('price').value = service.price;
        setFormMode('edit', serviceId); 
        
        alert(`Editando serviço: ${service.name}. Altere os campos e clique em 'Salvar Edição'.`);

    } catch (error) {
        console.error("Erro na função editService:", error);
        alert(error.message);
    }
}

async function submitEdit() {
    if (currentEditingId === null) return; 

    const name = document.getElementById('name').value;
    const duration = document.getElementById('duration').value;
    const buffer = document.getElementById('buffer').value;
    const price = document.getElementById('price').value;

    const payload = {
        name: name,
        duration_minutes: Number(duration),
        buffer_minutes: Number(buffer),
        price: Number(price)
    };

    try {
        const response = await fetch(`${API_URL}${currentEditingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Erro ${response.status}: ${text || "Erro ao salvar edição"}`);
        }

        alert("Serviço atualizado com sucesso!");
        setFormMode('add'); 
        loadServices(); 
        
    } catch (error) {
        console.error("Erro ao submeter edição:", error);
        alert(error.message);
    }
}

async function deleteService(serviceId) {
    if (!confirm(`Tem certeza que deseja deletar o serviço ID ${serviceId}? Esta ação é irreversível.`)) {
        return; 
    }

    try {
        const response = await fetch(`${API_URL}${serviceId}`, {
            method: "DELETE" 
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Erro ${response.status}: ${text || "Erro ao deletar serviço"}`);
        }

        alert(`Serviço ID ${serviceId} deletado com sucesso!`);
        loadServices();

    } catch (error) {
        console.error("Erro na função deleteService:", error);
        alert(error.message);
    }
}

async function loadServices() {
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`Não foi possível carregar os serviços. Status: ${response.status}`);
        }
        
        const services = await response.json();

        const list = document.getElementById("services-list");
        list.innerHTML = "";

        services.forEach(service => {
            const li = document.createElement("li");
            li.className = "service-item-row"; 

            li.innerHTML = `
                <div class="service-info">
                    ${service.name} — ${service.duration_minutes} min — R$ ${service.price.toFixed(2)}
                </div>
                <div class="service-actions">
                    <button class="edit-btn" onclick="editService(${service.id})">Editar</button>
                    <button class="delete-btn" onclick="deleteService(${service.id})">Deletar</button>
                </div>
            `;
            list.appendChild(li);
        });
        
        if (services.length === 0) {
            list.innerHTML = `<li style="color: #FFD700; text-align: center;">Nenhum serviço cadastrado.</li>`;
        }
        
    } catch (error) {
        console.error("Erro na função loadServices:", error);
        const list = document.getElementById("services-list");
        list.innerHTML = `<li style="color: red;">Falha ao carregar serviços: ${error.message}</li>`;
    }
}

window.onload = () => {
    setFormMode('add');
    loadServices();
};