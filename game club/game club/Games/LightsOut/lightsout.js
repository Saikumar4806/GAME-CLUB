window.onload = function() {
    const grid = document.getElementById('grid');
    const difficultySelect = document.getElementById('difficulty');
    const moveCountDisplay = document.getElementById('moveCount');
    const gameMessage = document.getElementById('gameMessage');
    let moveCount = 0;
    let currentSize = 5;
    let gameState = [];

    // Initialize the game
    function initGame(size = 5) {
        currentSize = size;
        grid.innerHTML = '';
        moveCount = 0;
        moveCountDisplay.textContent = '0';
        gameState = [];
        gameMessage.textContent = '';

        // Create grid
        grid.style.gridTemplate = `repeat(${size}, 1fr) / repeat(${size}, 1fr)`;
        
        for (let i = 0; i < size; i++) {
            gameState[i] = [];
            for (let j = 0; j < size; j++) {
                const cell = document.createElement('div');
                cell.className = 'light';
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.addEventListener('click', handleClick);
                grid.appendChild(cell);
                gameState[i][j] = false;
            }
        }

        // Randomize initial state with solvable pattern
        randomizeGrid();
    }

    // Handle cell click
    function handleClick(e) {
        const row = parseInt(e.target.dataset.row);
        const col = parseInt(e.target.dataset.col);
        toggleLights(row, col);
        moveCount++;
        moveCountDisplay.textContent = moveCount;
        checkWin();
    }

    // Toggle lights
    function toggleLights(row, col) {
        // Toggle clicked cell and adjacent cells
        toggleCell(row, col);
        toggleCell(row-1, col);
        toggleCell(row+1, col);
        toggleCell(row, col-1);
        toggleCell(row, col+1);
    }

    // Toggle individual cell
    function toggleCell(row, col) {
        if (row >= 0 && row < currentSize && col >= 0 && col < currentSize) {
            gameState[row][col] = !gameState[row][col];
            const cell = grid.children[row * currentSize + col];
            cell.classList.toggle('on');
        }
    }

    // Randomize grid with solvable pattern
    function randomizeGrid() {
        // Make random moves to ensure solvable puzzle
        const moves = Math.floor(Math.random() * 10) + 10;
        for (let i = 0; i < moves; i++) {
            const row = Math.floor(Math.random() * currentSize);
            const col = Math.floor(Math.random() * currentSize);
            toggleLights(row, col);
        }
    }

    // Check win condition
    function checkWin() {
        const isWin = gameState.every(row => row.every(cell => !cell));
        if (isWin) {
            gameMessage.textContent = `Congratulations! You won in ${moveCount} moves!`;
            gameMessage.className = 'game-message win';
            gameMessage.style.display = '';
            return true;
        }
        return false;
    }

    // Event Listeners
    document.getElementById('newGame').addEventListener('click', () => {
        initGame(currentSize);
    });

    document.getElementById('resetGame').addEventListener('click', () => {
        initGame(currentSize);
    });

    difficultySelect.addEventListener('change', (e) => {
        const sizes = { easy: 3, medium: 5, hard: 7 };
        initGame(sizes[e.target.value]);
    });

    // Start game
    initGame();
}; 