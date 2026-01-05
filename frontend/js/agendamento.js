// =================================================================
// CONFIGURAÇÕES GLOBAIS E VARIÁVEIS DE DOM
// =================================================================

const API_SERVICE_URL = "http://127.0.0.1:8000/services/"; 
// Novo: URL para submeter o agendamento
const API_APPOINTMENT_URL = "http://127.0.0.1:8000/appointments/"; 
// Novo: URL para buscar horários disponíveis (se existir)
const API_AVAILABILITY_URL = "http://127.0.0.1:8000/availability/"; 

const calendarGrid = document.getElementById('calendar-grid');
const currentMonthYearHeader = document.getElementById('current-month-year');
const prevMonthButton = document.getElementById('prev-month');
const nextMonthButton = document.getElementById('next-month');
const serviceSelect = document.getElementById('service-select');
const dateDisplay = document.getElementById('selected-date-display');
const modal = document.getElementById('appointment-modal');
const closeModalButton = document.querySelector('.close-button');

// Campos do Modal
const appointmentEmailInput = document.getElementById('appointment-email');
const turnoSelect = document.getElementById('turno'); // <select id="turno">
const scheduleButton = document.getElementById('schedule-button');

let currentDisplayDate = new Date(); // Mês atualmente exibido no calendário
let selectedDateString = null; // Data selecionada no calendário (Ex: "YYYY-MM-DD")
let selectedTime = null; // Hora selecionada no modal (Ex: "10:00:00")


// =================================================================
// 1. CARREGAMENTO DE SERVIÇOS
// =================================================================

async function loadServicesIntoSelect() {
    try {
        const response = await fetch(API_SERVICE_URL);
        if (!response.ok) {
            throw new Error(`Falha ao carregar serviços: Status ${response.status}`);
        }
        
        const services = await response.json();
        serviceSelect.innerHTML = '<option value="0">Selecione um Serviço</option>';

        services.forEach(service => {
            const option = document.createElement('option');
            // Nota: Se o backend retornar apenas o nome e ID, use-os. 
            // Estou mantendo os data-attributes para fins de compatibilidade futura.
            option.value = service.id; 
            option.setAttribute('data-duration', service.duration_minutes || 60); // Assumindo campos de API
            option.setAttribute('data-price', service.price || 0.0);
            option.textContent = `${service.name} — ${service.duration_minutes || '?'} min — R$ ${service.price ? service.price.toFixed(2) : '0,00'}`;
            serviceSelect.appendChild(option);
        });

    } catch (error) {
        console.error("Erro ao carregar serviços:", error);
        const errorOption = document.createElement('option');
        errorOption.textContent = 'Erro ao carregar serviços.';
        errorOption.disabled = true;
        serviceSelect.appendChild(errorOption);
    }
}


// =================================================================
// 2. GERENCIAMENTO DO CALENDÁRIO
// =================================================================

function renderCalendar() {
    calendarGrid.innerHTML = ''; 

    const year = currentDisplayDate.getFullYear();
    const month = currentDisplayDate.getMonth();
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
                         "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    currentMonthYearHeader.textContent = `${monthNames[month]} ${year}`;

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Espaços vazios
    for (let i = 0; i < firstDayOfMonth; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day day-off';
        calendarGrid.appendChild(dayDiv);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        const date = new Date(year, month, day);
        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        dayDiv.textContent = day;
        dayDiv.className = 'day day-available';
        dayDiv.setAttribute('data-date', dateString);
        
        // Desabilitar dias passados
        if (date.getTime() < today.getTime()) {
             dayDiv.classList.remove('day-available');
             dayDiv.classList.add('day-past');
        } else {
            if (date.getTime() === today.getTime()) {
                dayDiv.classList.add('today');
            }
            dayDiv.addEventListener('click', () => openAppointmentModal(dateString));
        }

        calendarGrid.appendChild(dayDiv);
    }
}

function goToNextMonth() {
    currentDisplayDate.setMonth(currentDisplayDate.getMonth() + 1);
    renderCalendar();
}

function goToPrevMonth() {
    const today = new Date();
    // Impede voltar para o mês anterior ao atual
    if (currentDisplayDate.getFullYear() === today.getFullYear() && currentDisplayDate.getMonth() === today.getMonth()) {
        return; 
    }
    
    currentDisplayDate.setMonth(currentDisplayDate.getMonth() - 1);
    renderCalendar();
}

// =================================================================
// 3. FUNÇÕES DO MODAL E SUBMISSÃO
// =================================================================

/**
 * Abre o modal e configura a data.
 */
function openAppointmentModal(dateString) {
    selectedDateString = dateString; // Armazena a data selecionada no formato YYYY-MM-DD
    const [year, month, day] = dateString.split('-');
    
    // Formato de exibição: DD/MM/YYYY
    dateDisplay.textContent = `${day}/${month}/${year}`;
    
    // Opcional: Chamar uma função para carregar horários disponíveis para esta data
    // loadAvailableTimes(dateString); 
    
    modal.style.display = 'block';
    scheduleButton.disabled = false; // Habilita o botão
    selectedTime = null; // Reseta a hora
}

function closeModal() {
    modal.style.display = 'none';
    serviceSelect.value = '0';
    appointmentEmailInput.value = '';
    turnoSelect.value = turnoSelect.options[0].value; // Reseta o select de turno
    selectedTime = null;
}

/**
 * Captura a hora selecionada (necessária para compatibilidade com o HTML fornecido).
 * Nota: A lógica de seleção de hora foi simplificada para usar o <select> do HTML.
 */
function getSelectedTimeValue() {
    const selectedText = turnoSelect.options[turnoSelect.selectedIndex].text;
    
    // Lógica para extrair a hora no formato HH:MM:SS
    // Exemplo: 'Manhã (09h)' -> '09:00:00'
    const match = selectedText.match(/\((\d{2})h\)/);
    if (match) {
        return `${match[1]}:00:00`;
    }
    // Se o formato não corresponder (usando values 'manha', 'tarde'),
    // Retornamos um placeholder ou o valor bruto, mas isso é arriscado.
    return turnoSelect.value; 
}


/**
 * Submete os dados do agendamento para o endpoint POST da API.
 */
scheduleButton.addEventListener('click', async (event) => {
    event.preventDefault(); 
    
    const serviceName = serviceSelect.options[serviceSelect.selectedIndex].text.split('—')[0].trim();
    const serviceId = serviceSelect.value;
    const email = appointmentEmailInput.value.trim();
    const timeValue = getSelectedTimeValue();
    
    // 1. Validação
    if (serviceSelect.value === '0' || !email || !timeValue || !selectedDateString) {
        alert("Por favor, preencha todos os campos do agendamento (Serviço, Email, Data e Horário).");
        return;
    }
    
    // 2. Construção dos dados
    // O seu modelo espera service (String), client_email (String) e time (String).
    const dataToSend = {
        service: serviceName,
        client_email: email,
        // Envia a hora no formato HH:MM:SS, conforme extraído
        appointment_time: timeValue, 
        // Opcional: Se o seu backend precisar da data
        selected_date: selectedDateString
    };
    
    scheduleButton.disabled = true; // Desabilita para evitar cliques múltiplos

    // 3. Requisição API
    try {
        const response = await fetch(API_APPOINTMENT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
        });

        if (response.ok) {
            alert('Agendamento confirmado com sucesso!');
            closeModal();
            // Opcional: re-renderizar o calendário para mostrar o novo agendamento
            // renderCalendar();
} else {
    const error = await response.json();
    let errorMessage = "Falha no agendamento. Detalhes: ";

    // Verifica se é um erro de validação do Pydantic (status 422)
    if (response.status === 422 && Array.isArray(error.detail)) {
        
        // Se for uma lista de erros, concatena-os
        const validationErrors = error.detail.map(err => {
            // Tenta obter o campo e a mensagem de erro
            const field = err.loc[err.loc.length - 1]; // Pega o último item (nome do campo)
            return `[${field}]: ${err.msg}`;
        }).join('\n - ');
        
        errorMessage += '\n' + validationErrors;
        
    } else if (error.detail) {
                // Se for outro erro de objeto simples (ex: 400 Bad Request)
                errorMessage += error.detail;
                
            } else {
                // Fallback para erros desconhecidos
                errorMessage += response.statusText;
            }
            
            alert(errorMessage);
            console.error('Erro detalhado da API:', error);
        }
    } catch (error) {
        alert('Erro de rede ou conexão com a API.');
        console.error('Erro na submissão:', error);
    } finally {
        scheduleButton.disabled = false;
    }
});


// =================================================================
// 4. LISTENERS DE EVENTOS E INICIALIZAÇÃO
// =================================================================

prevMonthButton.addEventListener('click', goToPrevMonth);
nextMonthButton.addEventListener('click', goToNextMonth);
closeModalButton.addEventListener('click', closeModal);

// Fechar modal ao clicar fora
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

// Inicialização
window.onload = () => {
    loadServicesIntoSelect();
    renderCalendar();
};