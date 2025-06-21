const easyBoard = [
    [5,3,null,null,7,null,null,null,null],
    [6,null,null,1,9,5,null,null,null],
    [null,9,8,null,null,null,null,6,null],
    [8,null,null,null,6,null,null,null,3],
    [4,null,null,8,null,3,null,null,1],
    [7,null,null,null,2,null,null,null,6],
    [null,6,null,null,null,null,2,8,null],
    [null,null,null,4,1,9,null,null,5],
    [null,null,null,null,8,null,null,7,9]
];
const mediumBoard = [
    [null,null,3,null,2,null,6,null,null],
    [9,null,null,3,null,5,null,null,1],
    [null,null,1,8,null,6,4,null,null],
    [null,null,8,1,null,2,9,null,null],
    [7,null,null,null,null,null,null,null,8],
    [null,null,6,7,null,8,2,null,null],
    [null,null,2,6,null,9,5,null,null],
    [8,null,null,2,null,3,null,null,9],
    [null,null,5,null,1,null,3,null,null]
];
const hardBoard = [
    [null,null,null,null,null,null,null,1,2],
    [null,null,null,null,null,7,null,null,null],
    [null,null,1,null,null,null,null,null,null],
    [null,9,null,null,null,null,2,null,null],
    [5,null,null,null,6,null,null,null,3],
    [null,null,6,null,null,null,null,7,null],
    [null,null,null,null,null,null,6,null,null],
    [null,null,null,4,null,null,null,null,null],
    [7,8,null,null,null,null,null,null,null]
];

let board = JSON.parse(JSON.stringify(mediumBoard));

function getBoardByLevel(level) {
    if (level === 'easy') return JSON.parse(JSON.stringify(easyBoard));
    if (level === 'medium') return JSON.parse(JSON.stringify(mediumBoard));
    if (level === 'hard') return JSON.parse(JSON.stringify(hardBoard));
    return JSON.parse(JSON.stringify(mediumBoard));
}

function createBoard() {
    const container = document.getElementById('sudoku-board');
    container.innerHTML = '';
    for(let r=0; r<9; r++) {
        for(let c=0; c<9; c++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.min = 1;
            input.max = 9;
            input.className = 'sudoku-cell';
            if(board[r][c]) {
                input.value = board[r][c];
                input.disabled = true;
                input.style.backgroundColor = '#f5f5f5';
            }
            input.dataset.row = r;
            input.dataset.col = c;
            input.oninput = function() {
                if (this.value && (this.value < 1 || this.value > 9)) {
                    this.value = '';
                }
                const messageDiv = document.getElementById('gameMessage');
                messageDiv.textContent = '';
                messageDiv.style.display = 'none';
                document.querySelectorAll('.sudoku-cell:not([disabled])').forEach(cell => {
                    cell.style.backgroundColor = '';
                    cell.style.color = '';
                });
            };
            container.appendChild(input);
        }
    }
}

function checkSolution() {
    const messageDiv = document.getElementById('gameMessage');
    let grid = Array.from({length:9},()=>Array(9).fill(null));
    document.querySelectorAll('.sudoku-cell').forEach(input => {
        const r = +input.dataset.row, c = +input.dataset.col;
        grid[r][c] = input.value ? +input.value : null;
    });

    if (grid.some(row => row.some(cell => !cell))) {
        messageDiv.textContent = 'Please fill in all cells before checking!';
        messageDiv.className = 'game-message error';
        messageDiv.style.display = '';
        alert('Please fill in all cells before checking!');
        return;
    }

    for (let row = 0; row < 9; row++) {
        let nums = new Set();
        for (let col = 0; col < 9; col++) {
            if (nums.has(grid[row][col])) {
                messageDiv.textContent = `Row ${row + 1} has duplicate numbers!`;
                messageDiv.className = 'game-message error';
                messageDiv.style.display = '';
                alert(`Row ${row + 1} has duplicate numbers!`);
                return;
            }
            nums.add(grid[row][col]);
        }
    }

    for (let col = 0; col < 9; col++) {
        let nums = new Set();
        for (let row = 0; row < 9; row++) {
            if (nums.has(grid[row][col])) {
                messageDiv.textContent = `Column ${col + 1} has duplicate numbers!`;
                messageDiv.className = 'game-message error';
                messageDiv.style.display = '';
                alert(`Column ${col + 1} has duplicate numbers!`);
                return;
            }
            nums.add(grid[row][col]);
        }
    }

    for (let boxRow = 0; boxRow < 3; boxRow++) {
        for (let boxCol = 0; boxCol < 3; boxCol++) {
            let nums = new Set();
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    let row = boxRow * 3 + i;
                    let col = boxCol * 3 + j;
                    if (nums.has(grid[row][col])) {
                        messageDiv.textContent = `Box at position ${boxRow + 1},${boxCol + 1} has duplicate numbers!`;
                        messageDiv.className = 'game-message error';
                        messageDiv.style.display = '';
                        alert(`Box at position ${boxRow + 1},${boxCol + 1} has duplicate numbers!`);
                        return;
                    }
                    nums.add(grid[row][col]);
                }
            }
        }
    }

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (grid[row][col] < 1 || grid[row][col] > 9) {
                messageDiv.textContent = `Invalid number at row ${row + 1}, column ${col + 1}. Use numbers 1-9 only!`;
                messageDiv.className = 'game-message error';
                messageDiv.style.display = '';
                alert(`Invalid number at row ${row + 1}, column ${col + 1}. Use numbers 1-9 only!`);
                return;
            }
        }
    }

    messageDiv.textContent = 'Congratulations! Your solution is correct!';
    messageDiv.className = 'game-message win';
    messageDiv.style.display = '';
    alert('Congratulations! Your solution is correct!');
    document.querySelectorAll('.sudoku-cell').forEach(input => {
        input.style.backgroundColor = '#e8f5e9';
        input.style.color = '#2e7d32';
    });
}

document.getElementById('checkSolution').onclick = checkSolution;
document.getElementById('difficulty').onchange = function() {
    board = getBoardByLevel(this.value);
    const messageDiv = document.getElementById('gameMessage');
    messageDiv.textContent = '';
    messageDiv.style.display = 'none';
    createBoard();
};
document.getElementById('newGame').onclick = function() {
    board = getBoardByLevel(document.getElementById('difficulty').value);
    const messageDiv = document.getElementById('gameMessage');
    messageDiv.textContent = '';
    messageDiv.style.display = 'none';
    createBoard();
};

document.getElementById('solvePuzzle').onclick = function() {
    // Get current board state
    let grid = Array.from({length:9},()=>Array(9).fill(null));
    document.querySelectorAll('.sudoku-cell').forEach(input => {
        const r = +input.dataset.row, c = +input.dataset.col;
        grid[r][c] = input.value ? +input.value : null;
    });
    if (solveSudoku(grid)) {
        // Update board and UI
        board = grid;
        createBoard();
        const messageDiv = document.getElementById('gameMessage');
        messageDiv.textContent = 'Puzzle solved!';
        messageDiv.className = 'game-message win';
        messageDiv.style.display = '';
        alert('Puzzle solved!');
    } else {
        const messageDiv = document.getElementById('gameMessage');
        messageDiv.textContent = 'No solution found!';
        messageDiv.className = 'game-message error';
        messageDiv.style.display = '';
        alert('No solution found!');
    }
};

function solveSudoku(grid) {
    function isValid(r, c, val) {
        for (let i = 0; i < 9; i++) {
            if (grid[r][i] === val || grid[i][c] === val) return false;
        }
        const br = Math.floor(r/3)*3, bc = Math.floor(c/3)*3;
        for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
            if (grid[br+i][bc+j] === val) return false;
        }
        return true;
    }
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (!grid[r][c]) {
                for (let val = 1; val <= 9; val++) {
                    if (isValid(r, c, val)) {
                        grid[r][c] = val;
                        if (solveSudoku(grid)) return true;
                        grid[r][c] = null;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

createBoard(); 