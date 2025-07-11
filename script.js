const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game constants
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 14;
const PADDLE_MARGIN = 16;
const PADDLE_SPEED = 5;
const BALL_SPEED = 6;

// Game variables
let leftPaddleY = HEIGHT / 2 - PADDLE_HEIGHT / 2;
let rightPaddleY = HEIGHT / 2 - PADDLE_HEIGHT / 2;
let ballX = WIDTH / 2 - BALL_SIZE / 2;
let ballY = HEIGHT / 2 - BALL_SIZE / 2;
let ballDX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
let ballDY = BALL_SPEED * (Math.random() * 2 - 1);

// Mouse movement for left paddle
canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  let mouseY = e.clientY - rect.top;
  leftPaddleY = mouseY - PADDLE_HEIGHT / 2;
  // Clamp paddle within bounds
  leftPaddleY = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, leftPaddleY));
});

// Game loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function update() {
  // Move ball
  ballX += ballDX;
  ballY += ballDY;

  // Ball collision with top/bottom walls
  if (ballY <= 0) {
    ballY = 0;
    ballDY *= -1;
  }
  if (ballY + BALL_SIZE >= HEIGHT) {
    ballY = HEIGHT - BALL_SIZE;
    ballDY *= -1;
  }

  // Ball collision with left paddle
  if (
    ballX <= PADDLE_MARGIN + PADDLE_WIDTH &&
    ballY + BALL_SIZE >= leftPaddleY &&
    ballY <= leftPaddleY + PADDLE_HEIGHT
  ) {
    ballX = PADDLE_MARGIN + PADDLE_WIDTH;
    ballDX *= -1;
    // Add angle
    ballDY += ((ballY + BALL_SIZE / 2) - (leftPaddleY + PADDLE_HEIGHT / 2)) * 0.15;
  }

  // Ball collision with right paddle
  if (
    ballX + BALL_SIZE >= WIDTH - PADDLE_MARGIN - PADDLE_WIDTH &&
    ballY + BALL_SIZE >= rightPaddleY &&
    ballY <= rightPaddleY + PADDLE_HEIGHT
  ) {
    ballX = WIDTH - PADDLE_MARGIN - PADDLE_WIDTH - BALL_SIZE;
    ballDX *= -1;
    // Add angle
    ballDY += ((ballY + BALL_SIZE / 2) - (rightPaddleY + PADDLE_HEIGHT / 2)) * 0.15;
  }

  // Ball out of bounds (reset)
  if (ballX < 0 || ballX > WIDTH) {
    resetBall();
  }

  // AI for right paddle: track the ball with simple prediction
  let targetY = ballY - PADDLE_HEIGHT / 2 + BALL_SIZE / 2;
  if (rightPaddleY + PADDLE_HEIGHT / 2 < targetY) {
    rightPaddleY += PADDLE_SPEED;
  } else if (rightPaddleY + PADDLE_HEIGHT / 2 > targetY) {
    rightPaddleY -= PADDLE_SPEED;
  }
  // Clamp right paddle
  rightPaddleY = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, rightPaddleY));
}

function resetBall() {
  ballX = WIDTH / 2 - BALL_SIZE / 2;
  ballY = HEIGHT / 2 - BALL_SIZE / 2;
  ballDX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
  ballDY = BALL_SPEED * (Math.random() * 2 - 1);
}

function draw() {
  // Clear
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // Draw center line
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 4;
  ctx.setLineDash([16, 14]);
  ctx.beginPath();
  ctx.moveTo(WIDTH / 2, 0);
  ctx.lineTo(WIDTH / 2, HEIGHT);
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw paddles
  ctx.fillStyle = '#fff';
  ctx.fillRect(PADDLE_MARGIN, leftPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT);
  ctx.fillRect(WIDTH - PADDLE_MARGIN - PADDLE_WIDTH, rightPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT);

  // Draw ball
  ctx.fillStyle = '#f5c518';
  ctx.fillRect(ballX, ballY, BALL_SIZE, BALL_SIZE);
}

// Start game loop
gameLoop();
