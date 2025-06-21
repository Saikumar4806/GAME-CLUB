window.onload = function() {
const canvas = document.getElementById('snake-canvas');
const ctx = canvas.getContext('2d');
const box = 20;
const rows = 20, cols = 20;
let snake, direction, food, score, game, gameOver, level, speed, paused = false;
const messageDiv = document.getElementById('gameMessage');
const scoreDiv = document.getElementById('score');
const restartBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const levelSelect = document.getElementById('difficulty');

function getSpeed(level) {
    if (level === 'easy') return 160;
    if (level === 'medium') return 100;
    if (level === 'hard') return 60;
    return 100;
}

function init() {
    snake = [{x: 9, y: 10}];
    direction = 'RIGHT';
    food = randomFood();
    score = 0;
    gameOver = false;
    level = levelSelect.value;
    speed = getSpeed(level);
    scoreDiv.textContent = 'Score: 0';
    messageDiv.textContent = '';
    messageDiv.style.display = 'none';
    paused = false;
    pauseBtn.innerHTML = '<i class="fas fa-pause me-2"></i>Pause';
    if (game) clearInterval(game);
    game = setInterval(draw, speed);
}

function randomFood() {
    let pos;
    do {
        pos = {x: Math.floor(Math.random()*cols), y: Math.floor(Math.random()*rows)};
    } while (snake.some(seg => seg.x === pos.x && seg.y === pos.y));
    return pos;
}

document.addEventListener('keydown', e => {
    if (gameOver) return;
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
    }
    if (e.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
    else if (e.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
    else if (e.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
    else if (e.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
    else if ((e.key === ' ' || e.key === 'Spacebar') && !gameOver) togglePause();
});

restartBtn.onclick = init;
pauseBtn.onclick = togglePause;
levelSelect.onchange = function() {
    init();
    canvas.focus();
};

function togglePause() {
    if (gameOver) return;
    paused = !paused;
    if (paused) {
        messageDiv.textContent = 'Paused';
        messageDiv.className = 'game-message info';
        messageDiv.style.display = '';
        pauseBtn.innerHTML = '<i class="fas fa-play me-2"></i>Resume';
    } else {
        messageDiv.textContent = '';
        messageDiv.style.display = 'none';
        pauseBtn.innerHTML = '<i class="fas fa-pause me-2"></i>Pause';
    }
}

function drawCell(x, y, color, border = true) {
    ctx.fillStyle = color;
    ctx.fillRect(x*box, y*box, box, box);
    if (border) {
        ctx.strokeStyle = '#fff';
        ctx.strokeRect(x*box, y*box, box, box);
    }
}

function draw() {
    if (paused) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw food
    drawCell(food.x, food.y, '#e67e22');
    // Draw snake
    for (let i = 0; i < snake.length; i++) {
        drawCell(snake[i].x, snake[i].y, i === 0 ? '#4caf50' : '#388e3c');
    }
    // Move snake
    let head = {...snake[0]};
    if (direction === 'LEFT') head.x--;
    if (direction === 'UP') head.y--;
    if (direction === 'RIGHT') head.x++;
    if (direction === 'DOWN') head.y++;

    // Level-based collision logic
    if (level === 'easy') {
        // Wrap around
        if (head.x < 0) head.x = cols - 1;
        if (head.x >= cols) head.x = 0;
        if (head.y < 0) head.y = rows - 1;
        if (head.y >= rows) head.y = 0;
    } else {
        // Wall collision
        if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
            clearInterval(game);
            messageDiv.textContent = 'GAME OVER!';
            messageDiv.className = 'game-message game-over';
            messageDiv.style.display = '';
            alert('GAME OVER!');
            gameOver = true;
            return;
        }
    }
    // Self collision
    if (snake.some(seg => seg.x === head.x && seg.y === head.y)) {
        clearInterval(game);
        messageDiv.textContent = 'GAME OVER!';
        messageDiv.className = 'game-message game-over';
        messageDiv.style.display = '';
        alert('GAME OVER!');
        gameOver = true;
        return;
    }
    snake.unshift(head);
    // Eat food
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreDiv.textContent = 'Score: ' + score;
        food = randomFood();
        // Easy: extra food every 5 points
        if (level === 'easy' && score % 5 === 0) {
            // Place another food (visual only, not eaten)
            let bonus = randomFood();
            drawCell(bonus.x, bonus.y, '#ffeb3b');
        }
    } else {
        // Hard: snake grows slower
        if (level === 'hard' && score > 0 && score % 3 !== 0) {
            snake.pop();
            snake.pop(); // Remove two segments for extra challenge
        } else {
            snake.pop();
        }
    }
}

init();
} 