let sessionHistory = JSON.parse(localStorage.getItem('sessionHistory')) || [];
let timer;
let isTimerRunning = false;
let timeLeft; // Tempo restante do timer

// Sons
const tickingSound = new Audio('toque.mp3'); // Som enquanto o timer está rodando
const alarmSound = new Audio('alarme.mp3.mp3'); // Som quando o timer terminar

// Função para salvar a sessão no localStorage
function saveSession(session) {
    sessionHistory.push(session);
    localStorage.setItem('sessionHistory', JSON.stringify(sessionHistory));
}

// Função para exibir o histórico de sessões na tela
function displaySessionHistory() {
    const sessionHistoryList = document.getElementById('sessionHistoryList');
    sessionHistoryList.innerHTML = ''; // Limpa o conteúdo anterior

    sessionHistory.forEach((session, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `Sessão ${index + 1}: ${session.type} - ${session.duration} minutos - ${session.timestamp}`;
        sessionHistoryList.appendChild(listItem);
    });
}

// Função para registrar uma sessão (Pomodoro ou Intervalo)
function endSession(type, duration) {
    const session = {
        type: type, // 'Pomodoro' ou 'Intervalo'
        duration: duration, // Duração em minutos
        timestamp: new Date().toLocaleString() // Data e hora atual
    };

    saveSession(session);  // Salvar a sessão
    displaySessionHistory();  // Atualizar o histórico exibido
}

// Função para iniciar o temporizador com tempo personalizado
function startTimer(duration, type) {
    timeLeft = duration * 60; // Converte minutos para segundos
    isTimerRunning = true;

    // Registrar a sessão quando o timer iniciar
    endSession(type, duration);

    tickingSound.loop = true; // Som de tique-taque contínuo enquanto o timer roda
    tickingSound.play(); // Começa o som de tique-taque

    timer = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        document.getElementById('timer').textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(timer);
            isTimerRunning = false;
            tickingSound.pause(); // Para o som de tique-taque
            alarmSound.play(); // Toca o som de alerta
            alert(`${type} concluído!`);
        }
    }, 1000);
}

// Função para iniciar o Pomodoro com tempo personalizado
document.getElementById('startPomodoro').addEventListener('click', () => {
    if (!isTimerRunning) {
        const pomodoroDuration = parseInt(document.getElementById('pomodoroTime').value); // Pega o valor personalizado
        startTimer(pomodoroDuration, 'Pomodoro'); // Iniciar o temporizador com a duração personalizada
    }
});

// Função para iniciar o Intervalo com tempo personalizado
document.getElementById('startBreak').addEventListener('click', () => {
    if (!isTimerRunning) {
        const breakDuration = parseInt(document.getElementById('breakTime').value); // Pega o valor personalizado
        startTimer(breakDuration, 'Intervalo'); // Iniciar o temporizador com a duração personalizada
    }
});

// Função para reiniciar o timer
document.getElementById('reset').addEventListener('click', () => {
    clearInterval(timer); // Parar o temporizador
    isTimerRunning = false;
    tickingSound.pause(); // Para o som de tique-taque quando o timer for resetado
    document.getElementById('timer').textContent = '25:00'; // Redefinir o display
});

// Função para zerar o histórico
document.getElementById('clearHistory').addEventListener('click', () => {
    localStorage.removeItem('sessionHistory'); // Remove o histórico do localStorage
    sessionHistory = []; // Limpa o array do histórico
    displaySessionHistory(); // Atualiza a exibição para mostrar um histórico vazio
});

// Exibir o histórico quando a página for carregada
document.addEventListener('DOMContentLoaded', function () {
    displaySessionHistory();
    document.getElementById('timer').textContent = '25:00'; // Timer inicial
});
