const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('highScore');
const playBtn = document.getElementById('playBtn');
const restartBtn = document.getElementById('restartBtn');

let dino, obstacles, score, highScore, gameSpeed, gravity, gameOver, playing;

let animationFrame;
let spacePressed = false;
let animationFrameId;
let holdingSpace = false;
let jumpCooldown = false;

function initGame() {
  cancelAnimationFrame(animationFrameId); // importante

  dino = {
    x: 50,
    y: 150,
    width: 40,
    height: 40,
    vy: 0,
    jumping: false
  };

  obstacles = [];
  score = 0;
  gameSpeed = 2.5; // REINICIA velocidad de movimiento
  gravity = 0.5;   // REINICIA gravedad
  gameOver = false;
  playing = true;
  spacePressed = false;

  scoreDisplay.textContent = `Puntaje: ${score}`;
  highScoreDisplay.textContent = `Récord: ${highScore}`;

  playBtn.style.display = 'none';
  restartBtn.style.display = 'none';
  canvas.style.display = 'block';
  disableScroll();
  gameLoop(); // ahora sí, empezamos limpio
}

function spawnObstacle() {
  obstacles.push({ x: canvas.width, y: 150, width: 20, height: 40 });
}

function update() {
  if (gameOver || !playing) return;

  dino.y += dino.vy;
  if (dino.y < 150) {
    dino.vy += gravity;
  } else {
    dino.y = 150;
    dino.jumping = false;
  }

  obstacles.forEach(obs => obs.x -= gameSpeed);
  obstacles = obstacles.filter(obs => obs.x + obs.width > 0);

  if (Math.random() < 0.01) spawnObstacle();

  obstacles.forEach(obs => {
    if (
      dino.x < obs.x + obs.width &&
      dino.x + dino.width > obs.x &&
      dino.y < obs.y + obs.height &&
      dino.y + dino.height > obs.y
    ) {
      gameOver = true;
      enableScroll();
      playing = false;

      if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
      }

      scoreDisplay.textContent = `Puntaje: ${score}`;
      highScoreDisplay.textContent = `Récord: ${highScore}`;

      cancelAnimationFrame(animationFrame);
      restartBtn.style.display = 'inline-block';
    }
    if (holdingSpace && !jumpCooldown && playing && !dino.jumping) {
  dino.vy = -10;
  dino.jumping = true;
  jumpCooldown = true;

  setTimeout(() => {
    jumpCooldown = false;
  }, 250); // puedes ajustar este número si salta muy rápido o muy lento
}
  });

  score++;
  if (score % 200 === 0) gameSpeed += 0.2;

  scoreDisplay.textContent = `Puntaje: ${score}`;
  highScoreDisplay.textContent = `Récord: ${highScore}`;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'green';
  ctx.fillRect(dino.x, dino.y, dino.width, dino.height);
  ctx.fillStyle = 'brown';
  obstacles.forEach(obs => ctx.fillRect(obs.x, obs.y, obs.width, obs.height));
}

function gameLoop() {
  update();
  draw();
animationFrameId = requestAnimationFrame(gameLoop);
}

// Controles
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    holdingSpace = true;
  }
});

document.addEventListener('keyup', (e) => {
  if (e.code === 'Space') {
    holdingSpace = false;
    jumpCooldown = false; // reinicia cooldown al soltar
  }
});

document.addEventListener('keyup', (e) => {
  if (e.code === 'Space') {
    spacePressed = false;
  }
});

playBtn.addEventListener('click', () => {
  initGame();
});

restartBtn.addEventListener('click', () => {
  initGame();
});

document.getElementById('toggleTheme').addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});
function disableScroll() {
  window.addEventListener('keydown', preventSpaceScroll);
}

function enableScroll() {
  window.removeEventListener('keydown', preventSpaceScroll);
}

function preventSpaceScroll(e) {
  if (e.code === 'Space' && playing) {
    e.preventDefault();
  }
}