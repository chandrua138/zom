const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// ================= PLAYER =================
const player = {
  x: 400,
  y: 300,
  radius: 15,
  speed: 5
};

// ================= INPUT =================
const keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// ================= MOUSE =================
const mouse = { x: 0, y: 0 };
canvas.addEventListener("mousemove", e => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

// ================= BULLETS =================
let bullets = [];
canvas.addEventListener("click", () => {
  const dx = mouse.x - player.x;
  const dy = mouse.y - player.y;
  const length = Math.hypot(dx, dy);

  bullets.push({
    x: player.x,
    y: player.y,
    vx: (dx / length) * 7,
    vy: (dy / length) * 7,
    radius: 5
  });
});

// ================= ZOMBIES =================
let zombies = [];
function spawnZombie() {
  zombies.push({
    x: Math.random() * 800,
    y: 0,
    radius: 20,
    speed: 1.5
  });
}

// TODO (Student Task): Call spawnZombie() every 2 seconds

// ================= SCORE =================
let score = 0;

// ================= UPDATE =================
function update() {
  // Player movement
  if (keys["w"]) player.y -= player.speed;
  if (keys["s"]) player.y += player.speed;
  if (keys["a"]) player.x -= player.speed;
  if (keys["d"]) player.x += player.speed;

  // Move bullets
  bullets.forEach(b => {
    b.x += b.vx;
    b.y += b.vy;
  });

  // Move zombies toward player
  zombies.forEach(z => {
    const dx = player.x - z.x;
    const dy = player.y - z.y;
    const dist = Math.hypot(dx, dy);
    z.x += (dx / dist) * z.speed;
    z.y += (dy / dist) * z.speed;
  });

  // Collision detection
  for (let i = zombies.length - 1; i >= 0; i--) {
    for (let j = bullets.length - 1; j >= 0; j--) {
      const dx = zombies[i].x - bullets[j].x;
      const dy = zombies[i].y - bullets[j].y;
      const dist = Math.hypot(dx, dy);

      if (dist < zombies[i].radius + bullets[j].radius) {
        zombies.splice(i, 1);
        bullets.splice(j, 1);
        score += 10;
        break;
      }
    }
  }
}

// ================= RENDER =================
function render() {
  ctx.clearRect(0, 0, 800, 600);

  // Player
  ctx.fillStyle = "blue";
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.fill();

  // Bullets
// Bullets (👉 emoji)
ctx.font = "20px Arial";
bullets.forEach(b => {
  ctx.fillText("❤️", b.x - 10, b.y + 10);
});


  // Zombies
  ctx.fillStyle = "green";
  zombies.forEach(z => {
    ctx.font = "30px Arial";
    ctx.fillText("🧟",z.x - 15,z.y + 10);
  });

  // Score
  ctx.fillStyle = "white";
  ctx.fillText("Score: " + score, 20, 30);
}

// ================= GAME LOOP =================
function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

setInterval(spawnZombie, 2000);
gameLoop();
