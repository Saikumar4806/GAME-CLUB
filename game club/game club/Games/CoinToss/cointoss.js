window.onload = function() {
    const flipBtn = document.getElementById('flipCoin');
    const chooseHeads = document.getElementById('chooseHeads');
    const chooseTails = document.getElementById('chooseTails');
    const gameMessage = document.getElementById('gameMessage');
    const totalFlips = document.getElementById('totalFlips');
    const correctGuesses = document.getElementById('correctGuesses');
    const winRate = document.getElementById('winRate');
    const coinImg = document.getElementById('coinImg');

    let stats = {
        total: 0,
        correct: 0
    };
    let isFlipping = false;
    let playerChoice = null;

    // Choice buttons event listeners
    chooseHeads.addEventListener('click', () => makeChoice('heads'));
    chooseTails.addEventListener('click', () => makeChoice('tails'));

    function makeChoice(choice) {
        playerChoice = choice;
        flipBtn.disabled = false;
        // Set both buttons to same color by default
        chooseHeads.classList.remove('btn-warning', 'btn-secondary', 'btn-primary', 'selected');
        chooseTails.classList.remove('btn-warning', 'btn-secondary', 'btn-primary', 'selected');
        chooseHeads.classList.add('btn-primary');
        chooseTails.classList.add('btn-primary');
        // Highlight selected
        if (choice === 'heads') {
            chooseHeads.classList.add('selected');
            chooseHeads.classList.add('btn-success');
            chooseTails.classList.remove('btn-success');
        } else {
            chooseTails.classList.add('selected');
            chooseTails.classList.add('btn-success');
            chooseHeads.classList.remove('btn-success');
        }
        gameMessage.textContent = `You chose ${choice.toUpperCase()}. Click Flip Coin to play!`;
        gameMessage.className = 'game-message info';
    }

    // Flip coin event listener
    flipBtn.addEventListener('click', () => {
        if (isFlipping || !playerChoice) return;
        flipCoin();
    });

    function flipCoin() {
        isFlipping = true;
        flipBtn.disabled = true;
        chooseHeads.disabled = true;
        chooseTails.disabled = true;

        // Simple random: even=heads, odd=tails
        const rand = Math.floor(Math.random() * 10000);
        const result = rand % 2 === 0 ? 'heads' : 'tails';

        // Show a quick 'flipping' effect with alternating images
        let flipFrames = 8;
        let frame = 0;
        let flipInterval = setInterval(() => {
            coinImg.src = frame % 2 === 0 ? '../../Assets/images/head.png' : '../../Assets/images/tail.png';
            frame++;
            if (frame >= flipFrames) {
                clearInterval(flipInterval);
            }
        }, 100);
        setTimeout(() => {
            coinImg.classList.remove('flipping');
            stats.total++;
            if (result === playerChoice) {
                stats.correct++;
                gameMessage.textContent = `It's ${result.toUpperCase()}! You won!`;
                gameMessage.className = 'game-message win';
            } else {
                gameMessage.textContent = `It's ${result.toUpperCase()}! You lost!`;
                gameMessage.className = 'game-message error';
            }

            // Show result image
            coinImg.src = result === 'heads' ? '../../Assets/images/head.png' : '../../Assets/images/tail.png';

            // Update stats display
            totalFlips.textContent = stats.total;
            correctGuesses.textContent = stats.correct;
            winRate.textContent = Math.round((stats.correct / stats.total) * 100);

            // Reset for next flip
            isFlipping = false;
            playerChoice = null;
            chooseHeads.disabled = false;
            chooseTails.disabled = false;
            chooseHeads.classList.remove('selected', 'btn-success');
            chooseTails.classList.remove('selected', 'btn-success');
            chooseHeads.classList.add('btn-primary');
            chooseTails.classList.add('btn-primary');
            flipBtn.disabled = true;
        }, 800);
    }
}; 