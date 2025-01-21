var timer; 
var sec = 0; 
var isPaused = false; 
var element = document.getElementById('Timer');
var button = document.getElementById('PauseIcon');
var icon = button.querySelector('i');

function startTimer() {
    timer = setInterval(() => {
        var minutes = Math.floor(sec / 60);
        var seconds = sec % 60;
        element.innerHTML = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        sec++;
    }, 1000);
}

function pause() {
    if (isPaused) {
        startTimer();
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
        isPaused = false;
    } else {
        clearInterval(timer);
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
        isPaused = true;
    }
}

startTimer();