window.onload = function() {
    const diceContainer = document.getElementById('diceContainer');
    const rollButton = document.getElementById('rollDice');
    const totalResult = document.getElementById('totalResult');
    const individualResults = document.getElementById('individualResults');
    const rollHistory = document.getElementById('rollHistory');
    const diceCountSelect = document.getElementById('diceCount');
    const diceSidesSelect = document.getElementById('diceSides');
    const gameMessage = document.getElementById('gameMessage');

    let isRolling = false;
    const history = [];
    const maxHistory = 5;

    // Dice face configurations for D6 (can be extended for other dice types)
    const diceDots = {
        1: [4],
        2: [0, 8],
        3: [0, 4, 8],
        4: [0, 2, 6, 8],
        5: [0, 2, 4, 6, 8],
        6: [0, 2, 3, 5, 6, 8]
    };

    function createDice() {
        diceContainer.innerHTML = '';
        const count = parseInt(diceCountSelect.value);
        
        for (let i = 0; i < count; i++) {
            const dice = document.createElement('div');
            dice.className = 'dice';
            
            // Create dots for D6
            for (let j = 0; j < 9; j++) {
                const dot = document.createElement('div');
                dot.className = 'dot';
                dice.appendChild(dot);
            }
            
            diceContainer.appendChild(dice);
        }
    }

    function showDots(diceElement, number) {
        // Reset all dots
        const dots = diceElement.getElementsByClassName('dot');
        Array.from(dots).forEach(dot => dot.classList.remove('active'));
        
        // Activate dots for the number
        if (diceDots[number]) {
            diceDots[number].forEach(index => {
                dots[index].classList.add('active');
            });
        }
    }

    function rollDice() {
        if (isRolling) return;
        isRolling = true;
        
        const count = parseInt(diceCountSelect.value);
        const sides = parseInt(diceSidesSelect.value);
        const results = [];
        const diceElements = diceContainer.getElementsByClassName('dice');
        
        gameMessage.textContent = 'Rolling...';
        gameMessage.className = 'game-message info';

        // Animation
        let rolls = 0;
        const totalRolls = 10;
        const rollInterval = setInterval(() => {
            Array.from(diceElements).forEach(dice => {
                const randomNum = Math.floor(Math.random() * sides) + 1;
                if (sides === 6) {
                    showDots(dice, randomNum);
                } else {
                    dice.innerHTML = `<span class='dice-number'>${randomNum}</span>`;
                }
            });
            
            rolls++;
            if (rolls >= totalRolls) {
                clearInterval(rollInterval);
                finalizeRoll();
            }
        }, 100);

        function finalizeRoll() {
            const results = [];
            Array.from(diceElements).forEach(dice => {
                const result = Math.floor(Math.random() * sides) + 1;
                results.push(result);
                if (sides === 6) {
                    showDots(dice, result);
                } else {
                    dice.innerHTML = `<span class='dice-number'>${result}</span>`;
                }
            });

            const total = results.reduce((a, b) => a + b, 0);
            totalResult.textContent = total;
            individualResults.textContent = `[${results.join(', ')}]`;

            // Add to history
            const historyEntry = {
                dice: `${count}d${sides}`,
                results: results,
                total: total
            };
            history.unshift(historyEntry);
            if (history.length > maxHistory) history.pop();
            updateHistory();

            gameMessage.textContent = `Rolled ${count}d${sides}: ${total}`;
            gameMessage.className = 'game-message win';
            isRolling = false;
        }
    }

    function updateHistory() {
        rollHistory.innerHTML = '';
        history.forEach(entry => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.textContent = `${entry.dice}: [${entry.results.join(', ')}] = ${entry.total}`;
            rollHistory.appendChild(historyItem);
        });
    }

    // Event Listeners
    rollButton.addEventListener('click', rollDice);
    
    diceCountSelect.addEventListener('change', createDice);
    diceSidesSelect.addEventListener('change', () => {
        const sides = parseInt(diceSidesSelect.value);
        const diceElements = diceContainer.getElementsByClassName('dice');
        
        Array.from(diceElements).forEach(dice => {
            if (sides === 6) {
                dice.innerHTML = '';
                for (let i = 0; i < 9; i++) {
                    const dot = document.createElement('div');
                    dot.className = 'dot';
                    dice.appendChild(dot);
                }
            } else {
                dice.innerHTML = `<span class='dice-number'>?</span>`;
            }
        });
    });

    // Initialize
    createDice();
}; 