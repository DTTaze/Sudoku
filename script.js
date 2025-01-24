var position = [0, 0];
var difficultMode = 1;
var numberOfError = 0;
let SudokuBoard = Array.from({length : 9}, () => Array(9).fill(0));
let SolutionBoard = Array.from({length : 9}, () => Array(9).fill(0));
var table = document.getElementById('SudokuTable');
let undoStack = [];

document.getElementById('EasyMode').addEventListener('click', function() {
    if (difficultMode !== 1){
        difficultMode = 1;
        generateNewSudokuBoard(); 
        displayBoard(); 
    }
});

document.getElementById('MediumMode').addEventListener('click', function() {
    if (difficultMode !== 2){
        difficultMode = 2;
        generateNewSudokuBoard(); 
        displayBoard(); 
    }
});

document.getElementById('HardMode').addEventListener('click', function() {
    if (difficultMode !== 3){
        difficultMode = 3;
        generateNewSudokuBoard(); 
        displayBoard(); 
    }
});

window.onload = function() {
    difficultMode = 1;
    startTimer();
    generateNewSudokuBoard(); 
    displayBoard();
};

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
    clearInterval(timer);
    icon.classList.remove('fa-pause');
    icon.classList.add('fa-play');
    document.getElementById('game-stop-screen').classList.remove('hidden');
    document.getElementById('message-resume-box').classList.remove('hidden');
    isPaused = true;
}

document.getElementById('resume-btn').addEventListener('click', function() {
    document.getElementById('game-stop-screen').classList.add('hidden');
    document.getElementById('message-resume-box').classList.add('hidden');
    startTimer();
    icon.classList.remove('fa-play');
    icon.classList.add('fa-pause');
});

function resetTimer() {
    clearInterval(timer); 
    sec = 0;
    element_timer.innerHTML = '00:00'; 
    startTimer();
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

function generateNewSudokuBoard() {
    createSolutionBoard(); 
    SudokuBoard = SolutionBoard.map(row => row.slice());
    removeCells(difficultMode);
}

function resetBoard() {
    clearState();
    generateNewSudokuBoard();
    displayBoard();
}

function displayBoard() {
    let tableCells = document.querySelectorAll("#SudokuTable td");
    let index = 0; 
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cellValue = SudokuBoard[row][col];
            tableCells[index].style.color = 'black';
            if (cellValue !== 0) {
                tableCells[index].textContent = cellValue;
            } else {
                tableCells[index].textContent = "";
            }
            index++;
        }
    }
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
    const startRow = Math.floor(row / 3) * 3; 
    const startCol = Math.floor(col / 3) * 3; 

    for (let r = startRow; r < startRow + 3; r++) {
        for (let c = startCol; c < startCol + 3; c++) {
            const cell = document.querySelector(`#SudokuTable tr:nth-child(${r + 1}) td:nth-child(${c + 1})`);
            cell.classList.add("highlight-cell");
        }
    }
}

function getCellPosition(cell) {
    const row = cell.parentNode.rowIndex; 
    const col = cell.cellIndex;         
    return [row, col];                     
}

const tableCells = document.querySelectorAll("#SudokuTable td");
tableCells.forEach(cell => {
    cell.addEventListener('click', () => {
        position = getCellPosition(cell);
        if (cell.innerText !== ""){
            const row = position[0];
            const col = position[1];

            removeHighlight();

            highlightRow(row);

            highlightColumn(col);
            
            highlightSameNumber(cell.innerText);

            highlightSubgrid(row, col);
        } else {
            removeHighlight();
            cell.classList.add("highlight-cell");
        }
    });
});

function clearState() {
    undoStack = [];
}

function saveState() {
    const currentState = [];
    for (let row = 0; row < 9; row++) {
        const rowState = [];
        for (let col = 0; col < 9; col++) {
            const cell = table.rows[row].cells[col];
            rowState.push(cell.textContent || "");
        }
        currentState.push(rowState);
    }
    console.log(currentState);
    undoStack.push(currentState);
}

function undo() {
    if (undoStack.length > 0) {
        const previousState = undoStack.pop();
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = table.rows[row].cells[col];
                cell.textContent = previousState[row][col];
            }
        }
    } else {
        alert("Không có gì để hoàn tác!");
    }
}

document.getElementById('undoBtn').addEventListener('click', function() {
    undo();
});

function eraseNum() {
    changeCellValue("");
}

document.getElementById('eraserBtn').addEventListener('click', function() {
    var cell = table.rows[position[0]].cells[position[1]];
    if(SudokuBoard[position[0]][position[1]] === 0) {
        eraseNum();
    }
});

function changeCellColorToRed() {
    var cell = table.rows[position[0]].cells[position[1]];
    cell.style.color = 'red';
}

function handleError() {
    numberOfError++;
    var ErrorNumber = document.getElementById('NumberError');
    ErrorNumber.innerText = numberOfError + '/' + '3';
    changeCellColorToRed();
    if(numberOfError === 3) {
        document.getElementById('game-stop-screen').classList.remove('hidden');
        document.getElementById('message-over-box').classList.remove('hidden');
        ErrorNumber.innerText = '0/3';
        numberOfError = 0;
        resetBoard();
        resetTimer();
    }
}

function changeCellValue(num) {
    var cell = table.rows[position[0]].cells[position[1]];
    cell.textContent = num;
}

function changeCellColorToBlack() {
    var cell = table.rows[position[0]].cells[position[1]];
    cell.style.color = 'black';
}

const numberDivs = document.getElementsByClassName('NumberValue');
for (let div of numberDivs) {
    div.addEventListener('click', () => {
        var num = parseInt(div.innerHTML);
        if(SudokuBoard[position[0]][position[1]] === 0) {
            saveState();
            changeCellValue(num);
            changeCellColorToBlack();
            if(num !== SolutionBoard[position[0]][position[1]]) {
                handleError();
            }
        } 
    });
}

document.getElementById('restart-btn').addEventListener('click', () => {
    document.getElementById('game-stop-screen').classList.add('hidden');
    document.getElementById('message-over-box').classList.add('hidden');
    generateNewSudokuBoard();
    displayBoard();
    resetTimer();
});

document.getElementById('NewGame').addEventListener('click', () => {
    generateNewSudokuBoard();
    var ErrorNumber = document.getElementById('NumberError');
    numberOfError = 0;
    ErrorNumber.innerText = '0/3';
    numberOfError = 0;
    displayBoard();
    resetTimer();
});