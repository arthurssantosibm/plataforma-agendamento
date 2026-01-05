const API_URL = "http://127.0.0.1:8000/services/"; 

const calendarGrid = document.getElementById('calendar-grid');
const currentMonthYearHeader = document.getElementById('current-month-year');
const prevMonthButton = document.getElementById('prev-month');
const nextMonthButton = document.getElementById('next-month');
const serviceSelect = document.getElementById('service-select');
const dateDisplay = document.getElementById('selected-date-display');
const modal = document.getElementById('appointment-modal');
const closeModalButton = document.querySelector('.close-button');

let currentDisplayDate = new Date();

async function loadServicesIntoSelect() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Falha ao carregar serviços: Status ${response.status}`);
        }
        
        const services = await response.json();
        serviceSelect.innerHTML = '<option value="0">Selecione um Serviço</option>';

        services.forEach(service => {
            const option = document.createElement('option');
            option.value = service.id; 
            option.setAttribute('data-duration', service.duration_minutes);
            option.setAttribute('data-price', service.price);
            option.textContent = `${service.name} — ${service.duration_minutes} min — R$ ${service.price.toFixed(2)}`;
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

function renderCalendar() {
    calendarGrid.innerHTML = ''; 

    const year = currentDisplayDate.getFullYear();
    const month = currentDisplayDate.getMonth();
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
                        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    currentMonthYearHeader.textContent = `${monthNames[month]} ${year}`;


    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    for (let i = 0; i < firstDayOfMonth; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day day-off';
        calendarGrid.appendChild(dayDiv);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        const date = new Date(year, month, day);
        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        dayDiv.textContent = day;
        dayDiv.className = 'day day-available';
        dayDiv.setAttribute('data-date', dateString);
        
        if (date.getTime() === today.getTime()) {
            dayDiv.classList.add('today');
        }
        
        dayDiv.addEventListener('click', () => openAppointmentModal(dateString));
        
        calendarGrid.appendChild(dayDiv);
    }
}

function selectTime(button, time) {
    document.querySelectorAll('.time-slot').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    button.classList.add('selected');
    selectedTime = time;
    scheduleButton.disabled = false;
}

function goToNextMonth() {
    currentDisplayDate.setMonth(currentDisplayDate.getMonth() + 1);
    renderCalendar();
}

function goToPrevMonth() {
    const today = new Date();
    if (currentDisplayDate.getFullYear() === today.getFullYear() && currentDisplayDate.getMonth() === today.getMonth()) {
        return; 
    }
    
    currentDisplayDate.setMonth(currentDisplayDate.getMonth() - 1);
    renderCalendar();
}

function openAppointmentModal(dateString) {
    const [year, month, day] = dateString.split('-');
    dateDisplay.textContent = `${day}/${month}/${year}`;
    modal.style.display = 'block';
}

function closeModal() {
    modal.style.display = 'none';
    serviceSelect.value = '0';
    document.getElementById('total-value').textContent = 'R$ 0,00';
}

prevMonthButton.addEventListener('click', goToPrevMonth);
nextMonthButton.addEventListener('click', goToNextMonth);
closeModalButton.addEventListener('click', closeModal);
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

window.onload = () => {
    loadServicesIntoSelect();
    renderCalendar();
};