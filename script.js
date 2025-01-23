var timer; 
var sec = 0; 
var isPaused = false; 
var element = document.getElementById('Timer');
var button = document.getElementById('PauseIcon');
var icon = button.querySelector('i');
var board = Array.from({length : 9}, () => Array(9).fill(0) )

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

function isSafe(board, row, col, num) {
    for(var i = 0; i<9; i++) {
        if(board[row][i] === num) return false
    }

    for(var i = 0; i<9; i++) {
        if(board[i][col] === num) return false
    }

    startRow = Math.floor(row/3) * 3
    startCol = Math.floor(col/3) * 3

    for(var i = 0; i<3; i++) {
        for(var j = 0; j<3; j++) {
            if(board[startRow+i][startCol+j] === num) return false
        }
    }

    return true
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


function createSudokuBoard(board) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] === 0) {
                const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
                for (let num of numbers) {
                    if (isSafe(board, i, j, num)) {
                        board[i][j] = num;
                        if (createSudokuBoard(board)) {
                            return true;
                        }
                        board[i][j] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

createSudokuBoard(board)
const tableCells = document.querySelectorAll("#Board table td");
let index = 0; 
for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
        const cellValue = board[row][col];
        if (cellValue !== 0) {
            tableCells[index].textContent = cellValue;
        }
        index++;
    }
}

function getCellPosition(cell) {
    const row = cell.parentNode.rowIndex + 1; 
    const col = cell.cellIndex + 1;          
    return { row, col };                     
}

tableCells.forEach(cell => {
    tableCells.addEventListener('click', () => {
        const position = getCellPosition(cell); 
    });
});
startTimer();