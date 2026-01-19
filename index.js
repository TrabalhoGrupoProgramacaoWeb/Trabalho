// ===== DADOS GLOBAIS =====
const quartos = [
    { id: 1, numero: '101', tipo: 'Single', preco: 50, imagem: 'IMG/transferir (1).jpg' },
    { id: 2, numero: '102', tipo: 'Duplo', preco: 80, imagem: 'IMG/pexels-quang-nguyen-vinh-222549-29000012.jpg' },
    { id: 3, numero: '103', tipo: 'Suite', preco: 150, imagem: 'IMG/pexels-didi-lecatompessy-2149441489-33125906.jpg' }
];

let reservaTemp = null;
let reservasConfirmadas = [];

// ===== CAROUSEL =====
const carousel = document.getElementById('carousel');
let index = 1;
let autoPlayInterval;

function initCarousel() {
    const firstClone = createCard(quartos[0]);
    const lastClone = createCard(quartos[quartos.length - 1]);

    carousel.innerHTML = lastClone + quartos.map(q => createCard(q)).join('') + firstClone;

    updatePosition(false);
    startAutoPlay();
}

function createCard(q) {
    return `
        <div class="card-quarto">
            <img src="${q.imagem}" alt="Quarto ${q.numero}">
            <h3>Quarto ${q.numero} - ${q.tipo}</h3>
            <p>${q.preco}€ / noite</p>
        </div>`;
}

function updatePosition(animate = true) {
    carousel.style.transition = animate ? "transform 0.5s ease-in-out" : "none";
    carousel.style.transform = `translateX(${-index * 100}%)`;
}

function moveSlide(step) {
    index += step;
    updatePosition();

    carousel.addEventListener('transitionend', () => {
        if (index >= quartos.length + 1) {
            index = 1;
            updatePosition(false);
        }
        if (index <= 0) {
            index = quartos.length;
            updatePosition(false);
        }
    }, { once: true });
}

function startAutoPlay() {
    autoPlayInterval = setInterval(() => moveSlide(1), 3000);
}

function manualMove(step) {
    clearInterval(autoPlayInterval);
    moveSlide(step);
    startAutoPlay();
}

// ===== QUARTOS =====
function renderQuartos() {
    const grid = document.getElementById('quartosGrid');
    if (!grid) {
        console.error('Elemento "quartosGrid" não encontrado!');
        return;
    }

    grid.innerHTML = '';
    quartos.forEach(quarto => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="room-image">
                <img src="${quarto.imagem}" alt="${quarto.tipo}">
            </div>
            <div class="room-title">Quarto ${quarto.numero}</div>
            <div class="room-type">${quarto.tipo}</div>
            <div class="room-price">€${quarto.preco}/noite</div>
        `;
        grid.appendChild(card);
    });
}

function preencherSelectQuartos() {
    const select = document.getElementById('quartoId');
    if (!select) return;

    select.innerHTML = '<option value="">Selecione um quarto</option>';

    quartos.forEach(quarto => {
        const option = document.createElement('option');
        option.value = quarto.id;
        option.textContent = `Quarto ${quarto.numero} - ${quarto.tipo} (€${quarto.preco}/noite)`;
        select.appendChild(option);
    });
}

// ===== RESERVAS =====
function calcularDias(checkIn, checkOut) {
    const date1 = new Date(checkIn);
    const date2 = new Date(checkOut);

    if (isNaN(date1) || isNaN(date2)) {
        alert('Datas inválidas!');
        return 0;
    }

    const diff = Math.abs(date2 - date1);
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function prepararReserva() {
    const cliente = document.getElementById('cliente')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const telefone = document.getElementById('telefone')?.value.trim();
    const quartoId = document.getElementById('quartoId')?.value;
    const checkIn = document.getElementById('checkIn')?.value;
    const checkOut = document.getElementById('checkOut')?.value;

    if (!cliente || !email || !telefone || !quartoId || !checkIn || !checkOut) {
        alert('Preencha todos os campos!');
        return;
    }

    const quarto = quartos.find(q => q.id === parseInt(quartoId));
    if (!quarto) {
        alert('Quarto inválido!');
        return;
    }

    const dias = calcularDias(checkIn, checkOut);
    if (dias <= 0) {
        alert('A data de check-out deve ser posterior ao check-in!');
        return;
    }

    const total = quarto.preco * dias;

    reservaTemp = { cliente, email, telefone, quarto, checkIn, checkOut, dias, total };
    alert(`Reserva preparada para ${cliente}. Total: €${total}`);
}

function confirmarReserva() {
    if (!reservaTemp) {
        alert('Nenhuma reserva preparada!');
        return;
    }

    reservasConfirmadas.push(reservaTemp);
    reservaTemp = null;

    renderReservasConfirmadas();
    renderDashboard();
    
    // Limpar formulário
    document.getElementById('reservaForm').reset();
    
    alert('Reserva confirmada com sucesso!');
}

function renderReservasConfirmadas() {
    const container = document.getElementById('reservasConfirmadas');
    if (!container) return;

    if (reservasConfirmadas.length === 0) {
        container.innerHTML = '<p style="color: #6b7280; margin-top: 16px;">Nenhuma reserva confirmada ainda.</p>';
        return;
    }

    container.innerHTML = '';

    reservasConfirmadas.forEach((reserva, index) => {
        const div = document.createElement('div');
        div.className = 'reserva-card';
        div.innerHTML = `
            <strong>${reserva.cliente}</strong><br>
            📧 ${reserva.email}<br>
            📞 ${reserva.telefone}<br>
            🏨 Quarto ${reserva.quarto.numero} (${reserva.quarto.tipo})<br>
            📅 ${reserva.checkIn} até ${reserva.checkOut} (${reserva.dias} noites)<br>
            💰 Total: €${reserva.total}
        `;
        container.appendChild(div);
    });
}

// ===== DASHBOARD =====
function gerarStatsDashboard() {
    const totalReservas = reservasConfirmadas.length;
    const faturacaoTotal = reservasConfirmadas.reduce((acc, r) => acc + r.total, 0);
    const mediaReserva = totalReservas > 0 ? (faturacaoTotal / totalReservas).toFixed(2) : 0;

    return { totalReservas, faturacaoTotal, mediaReserva };
}

function renderDashboard() {
    const grid = document.getElementById('statsGrid');
    if (!grid) return;

    const stats = gerarStatsDashboard();

    grid.innerHTML = `
        <div class="stat-card">
            <h3>💰 Faturação Total</h3>
            <p>€${stats.faturacaoTotal}</p>
        </div>

        <div class="stat-card">
            <h3>📦 Reservas</h3>
            <p>${stats.totalReservas}</p>
        </div>

        <div class="stat-card">
            <h3>🧾 Média por Reserva</h3>
            <p>€${stats.mediaReserva}</p>
        </div>
    `;
}

// ===== STICKY MENU =====
const originalMenu = document.querySelector('.header_baixo_menu_original');
const cloneMenu = document.querySelector('.header_baixo_menu.clone');

window.addEventListener('scroll', () => {
    if (!originalMenu || !cloneMenu) return;
    
    const menuOffset = originalMenu.offsetTop;
    
    if (window.scrollY > menuOffset + 50) {
        cloneMenu.classList.add('show');
    } else {
        cloneMenu.classList.remove('show');
    }
});

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    initCarousel();
    renderQuartos();
    preencherSelectQuartos();
    renderReservasConfirmadas();
    renderDashboard();
});