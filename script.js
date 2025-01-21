var timer; 
var sec = 0; 
var isPaused = false; 
var element = document.getElementById('Timer');

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
        isPaused = false;
    } else {
        clearInterval(timer);
        isPaused = true;
    }
}

startTimer();
