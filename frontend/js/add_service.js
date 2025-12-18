const API_URL = "http://127.0.0.1:8000/services/"; 

// Variável global para rastrear o ID do serviço que está sendo editado
let currentEditingId = null; 

// Obtém a referência do botão principal do formulário
const saveButton = document.querySelector('.service-form-container button');

/**
 * Funções de Utilidade para Form e Botão
 */
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


/**
 * 1. FUNÇÃO DE CRIAÇÃO (POST)
 */
async function addService() {
    if (currentEditingId !== null) return; // Garante que não está no modo de edição

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
        setFormMode('add'); // Limpa o formulário
        loadServices();

    } catch (error) {
        console.error("Erro na função addService:", error);
        alert(error.message);
    }
}


/**
 * 2. FUNÇÃO DE EDIÇÃO (GET e PUT/PATCH)
 */
async function editService(serviceId) {
    try {
        // 1. GET: Busca os dados do serviço
        const response = await fetch(`${API_URL}${serviceId}`); 
        
        if (!response.ok) {
            throw new Error(`Falha ao buscar detalhes do serviço ID ${serviceId}.`);
        }
        
        const service = await response.json();

        // 2. Preenche o formulário
        document.getElementById('name').value = service.name;
        document.getElementById('duration').value = service.duration_minutes;
        document.getElementById('buffer').value = service.buffer_minutes;
        document.getElementById('price').value = service.price;

        // 3. Altera o modo do formulário para edição
        setFormMode('edit', serviceId); 
        
        alert(`Editando serviço: ${service.name}. Altere os campos e clique em 'Salvar Edição'.`);

    } catch (error) {
        console.error("Erro na função editService:", error);
        alert(error.message);
    }
}

/**
 * 3. FUNÇÃO DE SUBMISSÃO DA EDIÇÃO (PUT/PATCH)
 */
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
        // PUT/PATCH: Envia os dados atualizados
        const response = await fetch(`${API_URL}${currentEditingId}`, {
            method: "PUT", // Use PUT ou PATCH conforme a sua API
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Erro ${response.status}: ${text || "Erro ao salvar edição"}`);
        }

        alert("Serviço atualizado com sucesso!");
        setFormMode('add'); // Reverte o formulário para o modo "Adicionar"
        loadServices(); 
        
    } catch (error) {
        console.error("Erro ao submeter edição:", error);
        alert(error.message);
    }
}


/**
 * 4. FUNÇÃO DE DELEÇÃO (DELETE)
 */
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
        loadServices(); // Recarrega a lista

    } catch (error) {
        console.error("Erro na função deleteService:", error);
        alert(error.message);
    }
}


/**
 * 5. FUNÇÃO DE CARREGAMENTO (GET - Listagem)
 * Esta função foi modificada para incluir os botões de Ação.
 */
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

            // Criando a estrutura com os botões e o ID do serviço
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

// Inicializa o modo do formulário e carrega os serviços
window.onload = () => {
    setFormMode('add');
    loadServices();
};