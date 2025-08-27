// FIFA Next Gen - Web Prototype
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const field = { width: 900, height: 600 };
const player = { x: 100, y: field.height / 2, w: 30, h: 30, color: '#00f', speed: 8 };
const ball = { x: field.width / 2, y: field.height / 2, r: 16, color: '#fff', dx: 0, dy: 0 };

const enemy = { x: field.width - 100, y: field.height / 2, w: 30, h: 30, color: '#f00' };
let score = [0, 0];

function drawField() {
  // Grass
  ctx.fillStyle = '#228B22';
  ctx.fillRect(0, 0, field.width, field.height);
  // Lines
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 5;
  ctx.strokeRect(0, 0, field.width, field.height);
  ctx.beginPath();
  ctx.arc(field.width / 2, field.height / 2, 90, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(field.width / 2, field.height / 2, 8, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(field.width / 2, 0);
  ctx.lineTo(field.width / 2, field.height);
  ctx.stroke();
}

function drawPlayer(p) {
  ctx.fillStyle = p.color;
  ctx.fillRect(p.x - p.w/2, p.y - p.h/2, p.w, p.h);
}

function drawBall(b) {
  ctx.beginPath();
  ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
  ctx.fillStyle = b.color;
  ctx.fill();
}

function draw() {
  drawField();
  drawPlayer(player);
  drawPlayer(enemy);
  drawBall(ball);
}

function update() {
  // Ball movement
  ball.x += ball.dx;
  ball.y += ball.dy;
  // Ball friction
  ball.dx *= 0.98;
  ball.dy *= 0.98;

  // Ball collision with walls
  if (ball.y < ball.r) { ball.y = ball.r; ball.dy *= -0.7; }
  if (ball.y > field.height - ball.r) { ball.y = field.height - ball.r; ball.dy *= -0.7; }

  // Goal detection
  if (ball.x < 0) { score[1] += 1; resetPositions(); }
  if (ball.x > field.width) { score[0] += 1; resetPositions(); }

  // Update score display
  document.getElementById('score').innerText = score[0] + " - " + score[1];
}

function resetPositions() {
  player.x = 100; player.y = field.height / 2;
  enemy.x = field.width - 100; enemy.y = field.height / 2;
  ball.x = field.width / 2; ball.y = field.height / 2;
  ball.dx = 0; ball.dy = 0;
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

// Keyboard controls
document.addEventListener('keydown', function(e) {
  switch (e.key) {
    case 'ArrowUp': if (player.y - player.h/2 > 0) player.y -= player.speed; break;
    case 'ArrowDown': if (player.y + player.h/2 < field.height) player.y += player.speed; break;
    case 'ArrowLeft': if (player.x - player.w/2 > 0) player.x -= player.speed; break;
    case 'ArrowRight': if (player.x + player.w/2 < field.width) player.x += player.speed; break;
    case ' ': // Shoot ball
      let dx = (ball.x - player.x), dy = (ball.y - player.y);
      let dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < player.w) {
        ball.dx = dx * 0.18;
        ball.dy = dy * 0.18;
      }
      break;
  }
});

resetPositions();
loop();
