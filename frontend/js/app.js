document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------
    // 1. Variáveis e Seletores
    // ----------------------------------------------------------------

    const calendarGrid = document.getElementById('calendar-grid');
    const currentMonthYearDisplay = document.getElementById('current-month-year');
    const prevMonthButton = document.getElementById('prev-month');
    const nextMonthButton = document.getElementById('next-month');

    const modal = document.getElementById('appointment-modal');
    const closeButton = document.querySelector('.close-button');
    const selectedDateDisplay = document.getElementById('selected-date-display');
    const serviceSelect = document.getElementById('service-select');
    const timeSlotsContainer = document.getElementById('available-times');
    const totalValueDisplay = document.getElementById('total-value');
    const scheduleButton = document.getElementById('schedule-button');

    let currentDate = new Date();
    let selectedDate = null;
    let selectedTime = null;
    let selectedPrice = 0;

    // Dados de exemplo (Substitua isso por uma chamada API real)
    const availableHours = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"];
    const services = {
        'corte': 50.00,
        'barba': 40.00,
        'completo': 85.00
    };

    // ----------------------------------------------------------------
    // 2. Funções do Calendário
    // ----------------------------------------------------------------

    /**
     * Renderiza o calendário para o mês e ano atuais.
     * @param {Date} date - Objeto Date contendo o mês e ano a serem exibidos.
     */
    function renderCalendar(date) {
        // Limpa o grid anterior
        calendarGrid.innerHTML = '';

        const year = date.getFullYear();
        const month = date.getMonth(); // 0 = Janeiro, 11 = Dezembro

        // Nomes dos meses
        const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
                            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        
        // Atualiza o display do cabeçalho
        currentMonthYearDisplay.textContent = `${monthNames[month]} ${year}`;

        // Obtém o primeiro dia do mês (0 = Domingo, 6 = Sábado)
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        // Obtém o último dia do mês (quantidade de dias no mês)
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // 1. Preenche os espaços vazios (dias do mês anterior)
        for (let i = 0; i < firstDayOfMonth; i++) {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('day', 'day-off');
            calendarGrid.appendChild(dayDiv);
        }

        // 2. Preenche os dias do mês
        for (let day = 1; day <= daysInMonth; day++) {
            const dayDiv = document.createElement('div');
            dayDiv.textContent = day;
            dayDiv.classList.add('day');
            
            const fullDateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            dayDiv.dataset.date = fullDateString;

            // Simulação de disponibilidade (Exemplo: todos os dias são disponíveis exceto o dia 17 e 25)
            if (day === 17 || day === 25) {
                 dayDiv.classList.add('day-unavailable');
                 dayDiv.title = "Dia indisponível.";
            } else {
                dayDiv.classList.add('day-available');
                dayDiv.addEventListener('click', () => openModal(fullDateString));
            }

            // Marca o dia atual (se for o mês e ano corrente)
            const today = new Date();
            if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayDiv.classList.add('today');
            }

            calendarGrid.appendChild(dayDiv);
        }
    }

    // 3. Event Listeners para Navegação do Calendário
    prevMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
    });

    nextMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
    });

    // ----------------------------------------------------------------
    // 3. Funções do Modal (Pop-up)
    // ----------------------------------------------------------------

    /**
     * Abre o modal e configura a data selecionada.
     * @param {string} dateString - Data selecionada no formato YYYY-MM-DD.
     */
    function openModal(dateString) {
        selectedDate = dateString;
        
        // Formata a data para exibição no modal
        const [year, month, day] = dateString.split('-');
        selectedDateDisplay.textContent = `${day}/${month}/${year}`;

        // Reseta as seleções anteriores do modal
        serviceSelect.value = '0';
        updateTotalValue();
        renderTimeSlots();
        scheduleButton.disabled = true;

        modal.style.display = 'block';
    }

    /**
     * Fecha o modal.
     */
    function closeModal() {
        modal.style.display = 'none';
        selectedDate = null;
        selectedTime = null;
    }

    /**
     * Renderiza os botões de horário disponíveis.
     */
    function renderTimeSlots() {
        timeSlotsContainer.innerHTML = '';
        selectedTime = null; // Reseta o horário selecionado

        availableHours.forEach(time => {
            const button = document.createElement('button');
            button.classList.add('time-slot');
            button.dataset.time = time;
            button.textContent = time;

            // Simulação de horário ocupado (Exemplo: 14:00 sempre ocupado)
            if (time === "14:00" && selectedDate === "2025-12-15") {
                button.classList.add('unavailable');
                button.disabled = true;
                button.textContent += " (Ocupado)";
            } else {
                button.addEventListener('click', handleTimeSelection);
            }
            timeSlotsContainer.appendChild(button);
        });
        checkScheduleButtonStatus();
    }

    /**
     * Lida com a seleção de horário.
     */
    function handleTimeSelection(event) {
        // Remove a classe 'selected' de todos os botões
        document.querySelectorAll('.time-slot').forEach(btn => {
            btn.classList.remove('selected');
        });

        // Adiciona a classe 'selected' ao botão clicado
        event.target.classList.add('selected');
        selectedTime = event.target.dataset.time;
        checkScheduleButtonStatus();
    }

    /**
     * Atualiza o valor total com base no serviço selecionado.
     */
    function updateTotalValue() {
        const serviceKey = serviceSelect.value;
        selectedPrice = services[serviceKey] || 0;
        totalValueDisplay.textContent = `R$ ${selectedPrice.toFixed(2).replace('.', ',')}`;
        checkScheduleButtonStatus();
    }

    /**
     * Verifica se o botão de agendamento deve ser habilitado.
     */
    function checkScheduleButtonStatus() {
        if (selectedDate && serviceSelect.value !== '0' && selectedTime) {
            scheduleButton.disabled = false;
        } else {
            scheduleButton.disabled = true;
        }
    }

    // 4. Event Listeners do Modal
    closeButton.addEventListener('click', closeModal);

    // Fechar o modal clicando fora dele
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    serviceSelect.addEventListener('change', updateTotalValue);

    scheduleButton.addEventListener('click', () => {
        // Ação de agendamento final
        if (scheduleButton.disabled) return;

        alert(`Agendamento Confirmado!
Data: ${selectedDate}
Hora: ${selectedTime}
Serviço: ${serviceSelect.options[serviceSelect.selectedIndex].text.split(' - ')[0]}
Valor: R$ ${selectedPrice.toFixed(2).replace('.', ',')}
        
(Na implementação real, aqui seria feita uma requisição para o servidor.)`);

        // Fechar o modal após o agendamento (simulado)
        closeModal();
    });


    // ----------------------------------------------------------------
    // 5. Inicialização
    // ----------------------------------------------------------------

    renderCalendar(currentDate);
});