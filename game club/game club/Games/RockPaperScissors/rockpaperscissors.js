window.onload = function() {
    const gameMessage = document.getElementById('gameMessage');
    const playerChoice = document.getElementById('playerChoice');
    const computerChoice = document.getElementById('computerChoice');
    const playerScore = document.getElementById('playerScore');
    const computerScore = document.getElementById('computerScore');
    const roundCount = document.getElementById('roundCount');
    const choiceButtons = document.querySelectorAll('.choice-btn');
    const newGameBtn = document.getElementById('newGame');

    const CHOICES = ['rock', 'paper', 'scissors'];
    const TOTAL_ROUNDS = 5;
    const EMOJIS = {
        rock: '✊',
        paper: '✋',
        scissors: '✌️'
    };

    let currentRound = 1;
    let scores = {
        player: 0,
        computer: 0
    };

    // Initialize game
    function initGame() {
        currentRound = 1;
        scores.player = 0;
        scores.computer = 0;
        updateScore();
        updateRound();
        enableButtons();
        playerChoice.textContent = '?';
        computerChoice.textContent = '?';
        gameMessage.textContent = 'Choose your weapon!';
        gameMessage.className = 'game-message info';
    }

    function updateScore() {
        playerScore.textContent = scores.player;
        computerScore.textContent = scores.computer;
    }

    function updateRound() {
        roundCount.textContent = `${currentRound}`;
    }

    function getComputerChoice() {
        return CHOICES[Math.floor(Math.random() * CHOICES.length)];
    }

    function determineWinner(player, computer) {
        if (player === computer) return 'tie';
        if ((player === 'rock' && computer === 'scissors') ||
            (player === 'paper' && computer === 'rock') ||
            (player === 'scissors' && computer === 'paper')) {
            return 'player';
        }
        return 'computer';
    }

    function displayChoices(playerMove, computerMove) {
        playerChoice.textContent = EMOJIS[playerMove];
        computerChoice.textContent = EMOJIS[computerMove];
    }

    function handleRoundResult(result) {
        switch(result) {
            case 'player':
                scores.player++;
                gameMessage.textContent = 'You won this round!';
                gameMessage.className = 'game-message win';
                break;
            case 'computer':
                scores.computer++;
                gameMessage.textContent = 'Computer won this round!';
                gameMessage.className = 'game-message error';
                break;
            case 'tie':
                gameMessage.textContent = "It's a tie!";
                gameMessage.className = 'game-message info';
                break;
        }
        updateScore();
    }

    function checkGameEnd() {
        if (currentRound >= TOTAL_ROUNDS) {
            const finalMessage = scores.player > scores.computer 
                ? 'Congratulations! You won the game!' 
                : scores.player < scores.computer 
                    ? 'Game Over! Computer wins!' 
                    : "It's a tie game!";
            
            gameMessage.textContent = finalMessage;
            gameMessage.className = scores.player > scores.computer 
                ? 'game-message win'
                : scores.player < scores.computer 
                    ? 'game-message error'
                    : 'game-message info';
            gameMessage.style.display = '';
            disableButtons();
            return true;
        }
        return false;
    }

    function enableButtons() {
        choiceButtons.forEach(button => button.disabled = false);
    }

    function disableButtons() {
        choiceButtons.forEach(button => button.disabled = true);
    }

    function handleChoice(e) {
        const playerMove = e.target.dataset.choice;
        // Animation: cycle computer symbol
        let animFrames = 7;
        let frame = 0;
        let animInterval = setInterval(() => {
            computerChoice.textContent = EMOJIS[CHOICES[frame % 3]];
            frame++;
            if (frame >= animFrames) {
                clearInterval(animInterval);
                // After animation, show real computer choice and result
                const computerMove = getComputerChoice();
                displayChoices(playerMove, computerMove);
                const result = determineWinner(playerMove, computerMove);
                handleRoundResult(result);
                if (!checkGameEnd()) {
                    currentRound++;
                    updateRound();
                }
            }
        }, 100);
        // Show player choice immediately
        playerChoice.textContent = EMOJIS[playerMove];
        disableButtons();
        setTimeout(enableButtons, animFrames * 100 + 100);
    }

    // Event Listeners
    choiceButtons.forEach(button => {
        button.addEventListener('click', handleChoice);
    });

    newGameBtn.addEventListener('click', initGame);

    // Start game
    initGame();
}; 