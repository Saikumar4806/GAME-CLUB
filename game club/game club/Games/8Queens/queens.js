const boardDiv = document.getElementById('queens-board');
const messageDiv = document.getElementById('gameMessage');
const N = 8;
let board = Array.from({length: N}, () => Array(N).fill(0));
let placedQueens = 0;

function renderBoard() {
    boardDiv.innerHTML = '';
    for(let r=0; r<N; r++) for(let c=0; c<N; c++) {
        const cell = document.createElement('span');
        cell.className = 'queen-cell ' + ((r + c) % 2 === 0 ? 'chess-light' : 'chess-dark');
        if (board[r][c]) cell.textContent = '♛';
        cell.onclick = () => handleCellClick(r, c);
        boardDiv.appendChild(cell);
    }
    document.getElementById('queensPlaced').textContent = placedQueens;
    document.getElementById('conflicts').textContent = countConflicts();
}

function isSafe(row, col) {
    for(let i=0;i<N;i++) if(board[row][i] && i!==col) return false;
    for(let i=0;i<N;i++) if(board[i][col] && i!==row) return false;
    for(let i=row-1,j=col-1;i>=0&&j>=0;i--,j--) if(board[i][j]) return false;
    for(let i=row+1,j=col+1;i<N&&j<N;i++,j++) if(board[i][j]) return false;
    for(let i=row-1,j=col+1;i>=0&&j<N;i--,j++) if(board[i][j]) return false;
    for(let i=row+1,j=col-1;i<N&&j>=0;i++,j--) if(board[i][j]) return false;
    return true;
}

function countConflicts() {
    let conflicts = 0;
    for(let r=0;r<N;r++) for(let c=0;c<N;c++) if(board[r][c] && !isSafe(r,c)) conflicts++;
    return conflicts;
}

function handleCellClick(row, col) {
    if (board.some(r => r[col])) return;
    if (board[row][col]) { board[row][col] = 0; placedQueens--; messageDiv.textContent = ''; messageDiv.style.display = 'none'; renderBoard(); return; }
    for(let c=0;c<N;c++) board[row][c]=0;
    board[row][col] = 1;
    placedQueens = board.flat().filter(x=>x).length;
    renderBoard();
    if (!isSafe(row, col)) { messageDiv.textContent = 'Invalid placement!'; messageDiv.className = 'game-message error'; messageDiv.style.display = ''; alert('Invalid placement!'); } else { messageDiv.textContent = ''; messageDiv.style.display = 'none'; }
    if (placedQueens === N) {
        if (isBoardValid()) { messageDiv.textContent = 'Congratulations!'; messageDiv.className = 'game-message win'; messageDiv.style.display = ''; alert('Congratulations!'); }
        else { messageDiv.textContent = 'Not a valid solution.'; messageDiv.className = 'game-message game-over'; messageDiv.style.display = ''; alert('Not a valid solution.'); }
    }
}

function isBoardValid() {
    for(let r=0;r<N;r++) for(let c=0;c<N;c++) if(board[r][c] && !isSafe(r,c)) return false;
    for(let c=0;c<N;c++) if(board.map(r=>r[c]).reduce((a,b)=>a+b,0)!==1) return false;
    for(let r=0;r<N;r++) if(board[r].reduce((a,b)=>a+b,0)!==1) return false;
    return true;
}

document.getElementById('newGame').onclick = function() {
    board = Array.from({length: N}, () => Array(N).fill(0));
    placedQueens = 0;
    messageDiv.textContent = '';
    messageDiv.style.display = 'none';
    renderBoard();
};
document.getElementById('checkSolution').onclick = function() {
    if (placedQueens !== N) { messageDiv.textContent = 'Place all 8 queens!'; messageDiv.className = 'game-message error'; messageDiv.style.display = ''; alert('Place all 8 queens!'); return; }
    if (isBoardValid()) { messageDiv.textContent = 'Congratulations!'; messageDiv.className = 'game-message win'; messageDiv.style.display = ''; alert('Congratulations!'); }
    else { messageDiv.textContent = 'Not a valid solution.'; messageDiv.className = 'game-message game-over'; messageDiv.style.display = ''; alert('Not a valid solution.'); }
};
document.getElementById('solvePuzzle').onclick = function() {
    board = Array.from({length: N}, () => Array(N).fill(0));
    placedQueens = 0;
    if (solve(0)) { placedQueens = N; renderBoard(); messageDiv.textContent = 'Puzzle solved!'; messageDiv.className = 'game-message win'; messageDiv.style.display = ''; alert('Puzzle solved!'); }
    else { renderBoard(); messageDiv.textContent = 'No solution found!'; messageDiv.className = 'game-message error'; messageDiv.style.display = ''; alert('No solution found!'); }
};
function solve(col) {
    if(col>=N) return true;
    for(let i=0;i<N;i++) {
        if(isSafe(i,col)) {
            board[i][col]=1;
            if(solve(col+1)) return true;
            board[i][col]=0;
        }
    }
    return false;
}
renderBoard(); 