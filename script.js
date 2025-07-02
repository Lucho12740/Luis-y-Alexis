let currentAudio = null;
let updateInterval = null;

// Función para formatear el tiempo (segundos a MM:SS)
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Función para actualizar la barra de progreso
function updateProgress(audioId) {
    const audio = document.getElementById(audioId);
    const progressBar = document.getElementById(`progress${audioId.slice(-1)}`);
    const currentTimeDisplay = document.getElementById(`current-time${audioId.slice(-1)}`);
    
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = `${progress}%`;
    currentTimeDisplay.textContent = formatTime(audio.currentTime);
}

// Función para alternar reproducción
function togglePlay(audioId) {
    const audio = document.getElementById(audioId);
    const playBtn = document.getElementById(`play-btn${audioId.slice(-1)}`);
    const playerCard = document.getElementById(`player${audioId.slice(-1)}`);
    
    // Si hay otro audio reproduciéndose, detenerlo
    if (currentAudio && currentAudio !== audio) {
        currentAudio.pause();
        const prevPlayBtn = document.getElementById(`play-btn${currentAudio.id.slice(-1)}`);
        const prevPlayerCard = document.getElementById(`player${currentAudio.id.slice(-1)}`);
        prevPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
        prevPlayerCard.classList.remove('active');
        clearInterval(updateInterval);
    }
    
    if (audio.paused) {
        audio.play();
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        playerCard.classList.add('active');
        currentAudio = audio;
        
        // Actualizar tiempo total
        const durationDisplay = document.getElementById(`duration${audioId.slice(-1)}`);
        durationDisplay.textContent = formatTime(audio.duration);
        
        // Actualizar progreso cada segundo
        updateInterval = setInterval(() => {
            updateProgress(audioId);
            
            // Detener al llegar al límite de tiempo
            const playerNum = audioId.slice(-1);
            const timeLimit = playerNum === '1' ? 60 : playerNum === '2' ? 120 : 180;
            
            if (audio.currentTime >= timeLimit) {
                audio.pause();
                audio.currentTime = 0;
                playBtn.innerHTML = '<i class="fas fa-play"></i>';
                playerCard.classList.remove('active');
                clearInterval(updateInterval);
                updateProgress(audioId);
            }
        }, 1000);
        
        // Actualizar progreso al hacer clic en la barra
        const progressContainer = playerCard.querySelector('.progress-container');
        progressContainer.addEventListener('click', (e) => {
            const rect = progressContainer.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            audio.currentTime = pos * audio.duration;
            updateProgress(audioId);
        });
    } else {
        audio.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        playerCard.classList.remove('active');
        clearInterval(updateInterval);
    }
    
    audio.onended = function() {
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        playerCard.classList.remove('active');
        clearInterval(updateInterval);
    };
}

// Función para retroceder 10 segundos
function seekBackward(audioId) {
    const audio = document.getElementById(audioId);
    audio.currentTime = Math.max(0, audio.currentTime - 10);
    updateProgress(audioId);
}

// Función para adelantar 10 segundos
function seekForward(audioId) {
    const audio = document.getElementById(audioId);
    const playerNum = audioId.slice(-1);
    const timeLimit = playerNum === '1' ? 60 : playerNum === '2' ? 120 : 180;
    audio.currentTime = Math.min(timeLimit, audio.currentTime + 10);
    updateProgress(audioId);
}

// Inicializar eventos para cada reproductor
document.addEventListener('DOMContentLoaded', function() {
    const players = ['audio1', 'audio2', 'audio3'];
    
    players.forEach(player => {
        const audio = document.getElementById(player);
        
        // Actualizar duración cuando el audio esté cargado
        audio.addEventListener('loadedmetadata', function() {
            const durationDisplay = document.getElementById(`duration${player.slice(-1)}`);
            durationDisplay.textContent = formatTime(audio.duration);
        });
    });
});