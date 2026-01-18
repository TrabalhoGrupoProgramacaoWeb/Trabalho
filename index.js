  // Dados de exemplo para os quartos
  const quartos = [
    { id: 1, numero: '101', tipo: 'Single', preco: 50, imagem: 'IMG/transferir (1).jpg' },
    { id: 2, numero: '102', tipo: 'Duplo', preco: 80, imagem: 'IMG/pexels-quang-nguyen-vinh-222549-29000012.jpg' },
    { id: 3, numero: '103', tipo: 'Suite', preco: 150, imagem: 'IMG/pexels-didi-lecatompessy-2149441489-33125906.jpg' },
    
];

let reservaTemp = null;

const reservasConfirmadas = [];

function preencherSelectQuartos() {
    const select = document.getElementById('quartoId');
    if (!select) {
        console.error('Select quartoId não encontrado');
        return;
    }

    select.innerHTML = '<option value="">Selecione um quarto</option>';

    quartos.forEach(quarto => {
        const option = document.createElement('option');
        option.value = quarto.id;
        option.textContent = `Quarto ${quarto.numero} - ${quarto.tipo} (€${quarto.preco}/noite)`;
        select.appendChild(option);
    });
}


// Função para calcular o número de dias entre duas datas
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

// Função para preparar uma reserva
function prepararReserva() {
    const cliente = document.getElementById('cliente')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const telefone = document.getElementById('telefone')?.value.trim();
    const quartoId = document.getElementById('quartoId')?.value;
    const checkIn = document.getElementById('checkIn')?.value;
    const checkOut = document.getElementById('checkOut')?.value;

    // Validação dos campos obrigatórios
    if (!cliente || !email || !telefone || !quartoId || !checkIn || !checkOut) {
        alert('Preencha todos os campos!');
        return;
    }

    // Verifica se o quarto existe
    const quarto = quartos.find(q => q.id === parseInt(quartoId));
    if (!quarto) {
        alert('Quarto inválido!');
        return;
    }

    // Calcula o número de dias e o total
    const dias = calcularDias(checkIn, checkOut);
    if (dias <= 0) {
        alert('A data de check-out deve ser posterior ao check-in!');
        return;
    }

    const total = quarto.preco * dias;

    // Cria a reserva temporária
    reservaTemp = { cliente, email, telefone, quarto, dias, total };
    alert(`Reserva preparada para ${cliente}. Total: €${total}`);
}

// Função para renderizar os quartos na página
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

// Evento para carregar os quartos ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    renderQuartos();
});





const originalMenu = document.querySelector('.header_baixo_menu');
const cloneMenu = document.querySelector('.header_baixo_menu.clone');
const menuOffset = originalMenu.offsetTop;

window.addEventListener('scroll', () => {
if (window.scrollY > menuOffset) {
cloneMenu.classList.add('show');
} else {
cloneMenu.classList.remove('show');
}
});

document.addEventListener('DOMContentLoaded', function () {
    renderQuartos();
    preencherSelectQuartos();
});

function confirmarReserva() {
    if (!reservaTemp) {
        alert('Nenhuma reserva preparada!');
        return;
    }

    reservasConfirmadas.push(reservaTemp);
    reservaTemp = null;

    renderReservasConfirmadas();
    alert('Reserva confirmada com sucesso!');
}

function renderReservasConfirmadas() {
    const container = document.getElementById('reservasConfirmadas');
    if (!container) return;

    container.innerHTML = '<h3>Reservas Confirmadas</h3>';

    reservasConfirmadas.forEach((reserva, index) => {
        container.innerHTML += `
            <div class="reserva-card">
                <strong>${reserva.cliente}</strong><br>
                Quarto ${reserva.quarto.numero} (${reserva.quarto.tipo})<br>
                ${reserva.dias} noites<br>
                Total: €${reserva.total}
            </div>
        `;
    });
}

function gerarStatsDashboard() {
    const totalReservas = reservasConfirmadas.length;

    const faturacaoTotal = reservasConfirmadas.reduce((acc, r) => acc + r.total, 0);

    const mediaReserva = totalReservas > 0
        ? (faturacaoTotal / totalReservas).toFixed(2)
        : 0;

    return {
        totalReservas,
        faturacaoTotal,
        mediaReserva
    };
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



function confirmarReserva() {
    if (!reservaTemp) {
        alert('Nenhuma reserva preparada!');
        return;
    }

    reservasConfirmadas.push(reservaTemp);
    reservaTemp = null;

    renderReservasConfirmadas();
    renderDashboard(); // 🔥 liga ao dashboard
}