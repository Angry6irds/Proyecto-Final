const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('highScore');
const toggleThemeBtn = document.getElementById('toggleTheme');

let dino = { x: 50, y: 150, width: 40, height: 40, vy: 0, jumping: false };
let obstacles = [];
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let gameSpeed = 5;
let gravity = 0.5;
let gameOver = false;

function resetGame() {
    score = 0;
    gameSpeed = 5;
    dino.y = 150;
    dino.vy = 0;
    obstacles = [];
    gameOver = false;
}

function spawnObstacle() {
    obstacles.push({ x: canvas.width, y: 150, width: 20, height: 40 });
}

function update() {
    if (gameOver) return;

    // Dino movimiento
    dino.y += dino.vy;
    if (dino.y < 150) {
        dino.vy += gravity;
    } else {
        dino.y = 150;
        dino.jumping = false;
    }

    // Obstáculos movimiento
    obstacles.forEach(obs => obs.x -= gameSpeed);

    // Eliminar obstáculos fuera de pantalla
    obstacles = obstacles.filter(obs => obs.x + obs.width > 0);

    // Spawn de obstáculos aleatorio
    if (Math.random() < 0.01) spawnObstacle();

    // Detección de colisiones
    obstacles.forEach(obs => {
        if (dino.x < obs.x + obs.width &&
            dino.x + dino.width > obs.x &&
            dino.y < obs.y + obs.height &&
            dino.y + dino.height > obs.y) {
            gameOver = true;
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('highScore', highScore);
            }
            alert('¡Game Over!');
            resetGame();
        }
    });

    // Incrementar velocidad y puntuación
    score++;
    if (score % 100 === 0) gameSpeed += 0.5;

    // Actualizar HUD
    scoreDisplay.textContent = `Puntaje: ${score}`;
    highScoreDisplay.textContent = `Récord: ${highScore}`;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar dinosaurio
    ctx.fillStyle = 'green';
    ctx.fillRect(dino.x, dino.y, dino.width, dino.height);

    // Dibujar obstáculos
    ctx.fillStyle = 'brown';
    obstacles.forEach(obs => ctx.fillRect(obs.x, obs.y, obs.width, obs.height));
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Controles
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !dino.jumping) {
        dino.vy = -10;
        dino.jumping = true;
    }
});

// Tema claro/oscuro
toggleThemeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// Iniciar juego
highScoreDisplay.textContent = `Récord: ${highScore}`;
gameLoop();