const boardDiv = document.getElementById('ttt-board');
const messageDiv = document.getElementById('gameMessage');
const statusDiv = document.getElementById('currentPlayer');
const resetBtn = document.getElementById('newGame');
let board = Array(9).fill(null);
let current = 'X';
let gameOver = false;

function render() {
    boardDiv.innerHTML = '';
    const winner = checkWin();
    for(let i=0;i<9;i++) {
        const btn = document.createElement('button');
        btn.className = 'ttt-cell';
        btn.textContent = board[i] || '';
        btn.disabled = !!board[i] || gameOver;
        if (winner && winner.cells.includes(i)) btn.classList.add('ttt-win');
        btn.onclick = () => move(i);
        boardDiv.appendChild(btn);
    }
    if (winner) {
        messageDiv.textContent = winner.player + ' wins!';
        messageDiv.className = 'game-message game-over';
        messageDiv.style.display = '';
        statusDiv.textContent = '';
        alert(winner.player + ' wins!');
    } else if (board.every(cell => cell)) {
        messageDiv.textContent = 'DRAW!';
        messageDiv.className = 'game-message game-over';
        messageDiv.style.display = '';
        statusDiv.textContent = '';
        alert('DRAW!');
    } else {
        messageDiv.textContent = '';
        messageDiv.className = '';
        messageDiv.style.display = 'none';
        statusDiv.textContent = current;
    }
}

function move(i) {
    if(board[i] || gameOver) return;
    board[i] = current;
    const winner = checkWin();
    if(winner || board.every(cell => cell)) gameOver = true;
    else current = current === 'X' ? 'O' : 'X';
    render();
}

function checkWin() {
    const wins = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];
    for(const line of wins) {
        const [a,b,c] = line;
        if(board[a] && board[a] === board[b] && board[a] === board[c])
            return {player: board[a], cells: line};
    }
    return null;
}

resetBtn.onclick = function() {
    board = Array(9).fill(null);
    current = 'X';
    gameOver = false;
    render();
};

render(); 