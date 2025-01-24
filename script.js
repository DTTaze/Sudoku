var position = [0, 0];
var difficultMode = 1;
var numberOfError = 0;
let SudokuBoard = Array.from({length : 9}, () => Array(9).fill(0));
let SolutionBoard = Array.from({length : 9}, () => Array(9).fill(0));

var element_timer = document.getElementById('Timer');
var timer; 
var sec = 0; 
function startTimer() {
    timer = setInterval(() => {
        var minutes = Math.floor(sec / 60);
        var seconds = sec % 60;
        element_timer.innerHTML = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        sec++;
    }, 1000);
}

var button = document.getElementById('PauseIcon');
var icon = button.querySelector('i');
var isPaused = false; 
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

document.getElementById('NewGame').addEventListener('click', () => {
    generateNewBoard();
    displayBoard();
    clearInterval(timer); 
    sec = 0;
    element_timer.innerHTML = '00:00'; 
    startTimer();
});

const numberDivs = document.getElementsByClassName('NumberValue');
for (let div of numberDivs) {
    div.addEventListener('click', () => {
        var num = parseInt(div.innerHTML);
        if(SudokuBoard[position[0]][position[1]] === 0) {
            if(num === SolutionBoard[position[0]][position[1]]) {
                SudokuBoard[position[0]][position[1]] = num;
                displayBoard();
            } else {
                numberOfError++;
                var ErrorNumber = document.getElementById('NumberError');
                ErrorNumber.innerText = numberOfError + '/' + '3';
                if(numberOfError > 3) {
                    ErrorNumber.innerText = '0/3';
                    numberOfError = 0;
                    generateNewBoard();
                    displayBoard();
                    clearInterval(timer); 
                    sec = 0;
                    element.innerHTML = '00:00'; 
                    startTimer();
                }
            }
        } 
    });
}

function isSafe(row, col, num) {
    for (var i = 0; i < 9; i++) {
        if (SolutionBoard[row][i] === num) return false;
    }

    for (var i = 0; i < 9; i++) {
        if (SolutionBoard[i][col] === num) return false;
    }

    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;

    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            if (SolutionBoard[startRow + i][startCol + j] === num) return false;
        }
    }

    return true;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createSolutionBoard() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (SolutionBoard[i][j] === 0) {
                const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
                for (let num of numbers) {
                    if (isSafe(i, j, num)) {
                        SolutionBoard[i][j] = num;
                        if (createSolutionBoard()) {
                            return true;
                        }
                        SolutionBoard[i][j] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function removeCells() {
    let cellsToRemove;

    switch (difficultMode) {
        case 1:
            cellsToRemove = 40; // Easy
            break;
        case 2:
            cellsToRemove = 50; // Medium
            break;
        case 3:
            cellsToRemove = 60; // Hard
            break;
        default:
            cellsToRemove = 40; // Default: Easy
    }

    while (cellsToRemove > 0) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);

        if (SudokuBoard[row][col] !== 0) {
            SudokuBoard[row][col] = 0;
            cellsToRemove--;
        }
    }
}

function generateNewBoard() {
    createSolutionBoard(); 
    SudokuBoard = SolutionBoard.map(row => row.slice());// Tạo bản sao sâu của SolutionBoard
    removeCells(difficultMode);
}

function displayBoard() {
    let tableCells = document.querySelectorAll("#SudokuTable td");
    let index = 0; 
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cellValue = SudokuBoard[row][col];
            if (cellValue !== 0) {
                tableCells[index].textContent = cellValue;
            } else {
                tableCells[index].textContent = "";
            }
            index++;
        }
    }
}

function getCellPosition(cell) {
    const row = cell.parentNode.rowIndex; 
    const col = cell.cellIndex;         
    return [row, col];                     
}

function highlightRow(row) {
    const rows = document.querySelectorAll("#SudokuTable tr");
    rows[row].classList.add("highlight-row");
}

function highlightColumn(col) {
    const cells = document.querySelectorAll(`#SudokuTable td:nth-child(${col + 1})`);
    cells.forEach(cell => {
        cell.classList.add("highlight-column");
    });
}

function removeHighlight() {
    const highlightedRows = document.querySelectorAll(".highlight-row");
    const highlightedColumns = document.querySelectorAll(".highlight-column");
    const highlightedCell = document.querySelectorAll(".highlight-cell");

    highlightedRows.forEach(row => row.classList.remove("highlight-row"));
    highlightedColumns.forEach(cell => cell.classList.remove("highlight-column"));
    highlightedCell.forEach(cell => cell.classList.remove("highlight-cell"));
}

function highlightSameNumber(value){
    const allCells = document.querySelectorAll("#SudokuTable td");

    allCells.forEach(cell => {
        if (cell.innerText === value){
            cell.classList.add("highlight-cell");
        }
    })

}

function highlightSubgrid(row, col) {
    const startRow = Math.floor(row / 3) * 3; // Tính chỉ số hàng bắt đầu của ô 3x3
    const startCol = Math.floor(col / 3) * 3; // Tính chỉ số cột bắt đầu của ô 3x3

    for (let r = startRow; r < startRow + 3; r++) {
        for (let c = startCol; c < startCol + 3; c++) {
            const cell = document.querySelector(`#SudokuTable tr:nth-child(${r + 1}) td:nth-child(${c + 1})`);
            cell.classList.add("highlight-cell");
        }
    }
}

const tableCells = document.querySelectorAll("#SudokuTable td");
tableCells.forEach(cell => {
    cell.addEventListener('click', () => {
        position = getCellPosition(cell);
    });
});

document.getElementById('EasyMode').addEventListener('click', function() {
    if (difficultMode !== 1){
    difficultMode = 1;
    generateNewBoard(); 
    displayBoard(); 
    }
});

document.getElementById('MediumMode').addEventListener('click', function() {
    if (difficultMode !== 2){
    difficultMode = 2;
    generateNewBoard(); 
    displayBoard(); 
    }
});

document.getElementById('HardMode').addEventListener('click', function() {
    if (difficultMode !== 3){
    difficultMode = 3;
    generateNewBoard(); 
    displayBoard(); 
    }
});

window.onload = function() {
    difficultMode = 1;
    generateNewBoard(); 
    displayBoard(); 
};
startTimer();