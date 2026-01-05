const API_URL = "http://127.0.0.1:8000/services/"; 
async function loadServices() {
    const listElement = document.getElementById("services-list");
    
    listElement.innerHTML = `<li class="loading-message">Carregando serviços...</li>`;

    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Falha na requisição. Status: ${response.status}`);
        }
        const services = await response.json();
        listElement.innerHTML = "";
        
        if (services.length === 0) {
            listElement.innerHTML = `<li class="empty-message">Nenhum serviço cadastrado.</li>`;
            return;
        }
        services.forEach(service => {
            const li = document.createElement("li");
            li.className = "service-item"; 
            li.innerHTML = `
                <div class="service-name">${service.name}</div>
                <div class="service-details">
                    <span class="duration">Duração: ${service.duration_minutes} min</span>
                    <span class="price">R$ ${service.price.toFixed(2)}</span>
                </div>
                <a href="agendamento.html"><button class="schedule-button">Agendar</button></a>
            `;
            listElement.appendChild(li);
        });

    } catch (error) {
        console.error("Erro ao carregar serviços:", error);
        listElement.innerHTML = `<li class="error-message">Erro ao carregar serviços: ${error.message}. Verifique o servidor.</li>`;
    }
}

window.onload = loadServices;