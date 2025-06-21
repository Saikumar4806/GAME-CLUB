window.onload = function() {
    const gameMessage = document.getElementById('gameMessage');
    const guessInput = document.getElementById('guessInput');
    const submitGuess = document.getElementById('submitGuess');
    const previousGuesses = document.getElementById('previousGuesses');
    const guessCount = document.getElementById('guessCount');
    const highScore = document.getElementById('highScore');
    const difficultySelect = document.getElementById('difficulty');
    const newGameBtn = document.getElementById('newGame');

    let targetNumber;
    let guesses;
    let maxNumber;
    let gameOver;
    let bestScores = {
        easy: Infinity,
        medium: Infinity,
        hard: Infinity
    };

    // Initialize game
    function initGame() {
        const difficulty = difficultySelect.value;
        maxNumber = getDifficultyRange(difficulty);
        targetNumber = Math.floor(Math.random() * maxNumber) + 1;
        guesses = 0;
        gameOver = false;
        
        // Reset UI
        guessInput.value = '';
        guessInput.max = maxNumber;
        previousGuesses.textContent = 'Previous Guesses: ';
        guessCount.textContent = 'Guesses: 0';
        gameMessage.textContent = `Guess a number between 1 and ${maxNumber}`;
        gameMessage.className = 'game-message info';
        gameMessage.style.display = '';
        
        // Enable input
        guessInput.disabled = false;
        submitGuess.disabled = false;
        
        updateHighScore();
    }

    function getDifficultyRange(difficulty) {
        switch(difficulty) {
            case 'easy': return 50;
            case 'hard': return 200;
            default: return 100;
        }
    }

    function updateHighScore() {
        const difficulty = difficultySelect.value;
        const best = bestScores[difficulty];
        highScore.textContent = `Best Score: ${best === Infinity ? '-' : best}`;
    }

    function handleGuess() {
        if (gameOver) return;

        const guess = parseInt(guessInput.value);
        if (isNaN(guess) || guess < 1 || guess > maxNumber) {
            gameMessage.textContent = `Please enter a valid number between 1 and ${maxNumber}`;
            gameMessage.className = 'game-message error';
            gameMessage.style.display = '';
            return;
        }

        guesses++;
        guessCount.textContent = `Guesses: ${guesses}`;
        previousGuesses.textContent += ` ${guess}`;

        if (guess === targetNumber) {
            gameOver = true;
            gameMessage.textContent = `Congratulations! You found the number in ${guesses} guesses!`;
            gameMessage.className = 'game-message win';
            gameMessage.style.display = '';
            guessInput.disabled = true;
            submitGuess.disabled = true;

            // Update high score
            const difficulty = difficultySelect.value;
            if (guesses < bestScores[difficulty]) {
                bestScores[difficulty] = guesses;
                updateHighScore();
            }
        } else {
            const hint = guess < targetNumber ? 'greater than' : 'less than';
            gameMessage.textContent = `The number is ${hint} ${guess}.`;
            gameMessage.className = 'game-message info';
            gameMessage.style.display = '';
        }

        guessInput.value = '';
    }

    // Event Listeners
    submitGuess.addEventListener('click', handleGuess);
    guessInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') handleGuess();
    });

    newGameBtn.addEventListener('click', initGame);
    
    difficultySelect.addEventListener('change', () => {
        initGame();
    });

    // Start game
    initGame();
}; 