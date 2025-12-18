// 1. Definição da URL do Endpoint
// É a mesma URL usada para listar/criar serviços, mas será usada com o método GET
const API_URL = "http://127.0.0.1:8000/services/"; 

/**
 * Função assíncrona para carregar e exibir todos os serviços da API.
 */
async function loadServices() {
    const listElement = document.getElementById("services-list");
    
    // Limpa a lista antes de carregar ou mostrar mensagens
    listElement.innerHTML = `<li class="loading-message">Carregando serviços...</li>`;

    try {
        // 2. Fazendo a requisição GET para buscar os dados
        // Não precisamos especificar o método se for GET, mas é opcional (aqui, vamos omitir)
        const response = await fetch(API_URL);
        
        // Verifica se a resposta foi bem-sucedida (status 200-299)
        if (!response.ok) {
            // Lança um erro se o status for 4xx ou 5xx
            throw new Error(`Falha na requisição. Status: ${response.status}`);
        }
        
        // 3. Converte a resposta para JSON
        const services = await response.json();

        // 4. Limpa o elemento antes de inserir os novos dados
        listElement.innerHTML = "";
        
        if (services.length === 0) {
            listElement.innerHTML = `<li class="empty-message">Nenhum serviço cadastrado.</li>`;
            return;
        }

        // 5. Itera sobre a lista de serviços e cria os elementos HTML
        services.forEach(service => {
            const li = document.createElement("li");
            // Se você quiser que o CSS estilize cada item, use a estrutura adequada.
            // Aqui, criamos um bloco que pode ser estilizado (ex: um <div>)
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
        // Tratamento de erros de rede ou da API
        console.error("Erro ao carregar serviços:", error);
        listElement.innerHTML = `<li class="error-message">Erro ao carregar serviços: ${error.message}. Verifique o servidor.</li>`;
    }
}

// 6. Chama a função assim que a janela estiver completamente carregada
window.onload = loadServices;