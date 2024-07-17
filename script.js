let timer;
let timeLeft = 3600; // Tiempo en segundos (60 minutos por defecto)
let isRunning = false;
let videos = [];
let workTime = 0; // Tiempo total trabajado en segundos
let darkMode = false;
let chronometers = {};

const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const resetButton = document.getElementById('resetButton');
const customMinutesInput = document.getElementById('customMinutes');
const setTimerButton = document.getElementById('setTimerButton');
const videoLinkInput = document.getElementById('videoLink');
const addVideoButton = document.getElementById('addVideoButton');
const videoList = document.getElementById('videoList');
const videoPlayer = document.getElementById('videoPlayer');
const videoFrame = document.getElementById('videoFrame');
const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');
const notes = document.getElementById('notes');
const workStats = document.getElementById('workStats');
const alarmSound = document.getElementById('alarmSound');
const chronoNameInput = document.getElementById('chronoName');
const addChronoButton = document.getElementById('addChronoButton');
const chronoList = document.getElementById('chronoList');
const toggleDarkMode = document.getElementById('toggleDarkMode');

startButton.addEventListener('click', startTimer);
stopButton.addEventListener('click', stopTimer);
resetButton.addEventListener('click', resetTimer);
setTimerButton.addEventListener('click', setCustomTimer);
addVideoButton.addEventListener('click', addVideo);
addTaskButton.addEventListener('click', addTask);
addChronoButton.addEventListener('click', addChronometer);
toggleDarkMode.addEventListener('click', toggleDarkModeFunc);

function startTimer() {
    if (isRunning) return;
    isRunning = true;
    timer = setInterval(updateTimer, 1000);
}

function stopTimer() {
    isRunning = false;
    clearInterval(timer);
}

function resetTimer() {
    stopTimer();
    timeLeft = 3600; // Reiniciar a 60 minutos por defecto
    updateDisplay();
}

function setCustomTimer() {
    const customMinutes = parseInt(customMinutesInput.value);
    if (!isNaN(customMinutes) && customMinutes > 0) {
        timeLeft = customMinutes * 60; // Convertir minutos a segundos
        updateDisplay();
    }
}

function updateTimer() {
    timeLeft--;
    workTime++;
    if (timeLeft <= 0) {
        stopTimer();
        playVideo();
        resetTimer(); // Reiniciar el temporizador a 60 minutos por defecto
    }
    updateDisplay();
    updateWorkStats();
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function addVideo() {
    const videoLink = videoLinkInput.value.trim();
    if (videoLink) {
        videos.push(videoLink);
        const listItem = document.createElement('div');
        listItem.textContent = videoLink;
        videoList.appendChild(listItem);
        videoLinkInput.value = '';
    }
}

function playVideo() {
    if (videos.length > 0) {
        const randomIndex = Math.floor(Math.random() * videos.length);
        const videoLink = videos[randomIndex];
        videoFrame.src = videoLink.replace("watch?v=", "embed/");
        videoPlayer.style.display = 'block';
        alarmSound.play();
    }
}

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText) {
        const listItem = document.createElement('li');
        listItem.textContent = taskText;
        listItem.addEventListener('click', () => {
            listItem.classList.toggle('completed');
        });
        taskList.appendChild(listItem);
        taskInput.value = '';
    }
}

function updateWorkStats() {
    const hours = Math.floor(workTime / 3600);
    const minutes = Math.floor((workTime % 3600) / 60);
    workStats.textContent = `Tiempo trabajado hoy: ${hours} horas, ${minutes} minutos`;
}

function addChronometer() {
    const chronoName = chronoNameInput.value.trim();
    if (chronoName) {
        const chronoId = `chrono-${Date.now()}`;
        chronometers[chronoId] = { time: 0, interval: null };

        const chronoDiv = document.createElement('div');
        chronoDiv.className = 'chronometer';
        chronoDiv.id = chronoId;

        const chronoNameSpan = document.createElement('span');
        chronoNameSpan.textContent = chronoName;
        chronoNameSpan.contentEditable = true; // Hacer el nombre editable
        chronoDiv.appendChild(chronoNameSpan);

        const chronoTimeSpan = document.createElement('span');
        chronoTimeSpan.textContent = '00:00';
        chronoDiv.appendChild(chronoTimeSpan);

        const chronoTimeInput = document.createElement('input');
        chronoTimeInput.type = 'text';
        chronoTimeInput.placeholder = 'MM:SS';
        chronoDiv.appendChild(chronoTimeInput);

        const updateChronoTimeButton = document.createElement('button');
        updateChronoTimeButton.textContent = 'Actualizar Tiempo';
        updateChronoTimeButton.addEventListener('click', () => updateChronometerTime(chronoId, chronoTimeInput.value));
        chronoDiv.appendChild(updateChronoTimeButton);

        const startChronoButton = document.createElement('button');
        startChronoButton.textContent = 'Iniciar';
        startChronoButton.addEventListener('click', () => startChronometer(chronoId));
        chronoDiv.appendChild(startChronoButton);

        const stopChronoButton = document.createElement('button');
        stopChronoButton.textContent = 'Detener';
        stopChronoButton.addEventListener('click', () => stopChronometer(chronoId));
        chronoDiv.appendChild(stopChronoButton);

        const resetChronoButton = document.createElement('button');
        resetChronoButton.textContent = 'Reiniciar';
        resetChronoButton.addEventListener('click', () => resetChronometer(chronoId));
        chronoDiv.appendChild(resetChronoButton);

        const deleteChronoButton = document.createElement('button');
        deleteChronoButton.textContent = 'Eliminar';
        deleteChronoButton.addEventListener('click', () => deleteChronometer(chronoId));
        chronoDiv.appendChild(deleteChronoButton);

        chronoList.appendChild(chronoDiv);
        chronoNameInput.value = '';
    }
}

function startChronometer(chronoId) {
    if (chronometers[chronoId].interval) return;
    chronometers[chronoId].interval = setInterval(() => {
        chronometers[chronoId].time++;
        updateChronometerDisplay(chronoId);
    }, 1000);
}

function stopChronometer(chronoId) {
    clearInterval(chronometers[chronoId].interval);
    chronometers[chronoId].interval = null;
}

function resetChronometer(chronoId) {
    stopChronometer(chronoId);
    chronometers[chronoId].time = 0;
    updateChronometerDisplay(chronoId);
}

function deleteChronometer(chronoId) {
    stopChronometer(chronoId);
    delete chronometers[chronoId];
    const chronoDiv = document.getElementById(chronoId);
    chronoDiv.remove();
}

function updateChronometerDisplay(chronoId) {
    const chronoTimeSpan = document.querySelector(`#${chronoId} span:nth-child(2)`);
    const minutes = Math.floor(chronometers[chronoId].time / 60);
    const seconds = chronometers[chronoId].time % 60;
    chronoTimeSpan.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateChronometerTime(chronoId, timeInput) {
    const [minutes, seconds] = timeInput.split(':').map(Number);
    if (!isNaN(minutes) && !isNaN(seconds)) {
        chronometers[chronoId].time = minutes * 60 + seconds;
        updateChronometerDisplay(chronoId);
    }
}

function toggleDarkModeFunc() {
    document.body.classList.toggle('dark-mode');
    darkMode = !darkMode;
}
