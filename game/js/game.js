// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", init);

// Game elements
let canvas, ctx;
let titleScreen, gameUI, gameOverScreen;
let startButton, restartButton;

// Game variables
let gameRunning = false;
let score = 0;
let lives = 3;
let bubblegumCount = 0;
let gameSpeed = 5;
let gameFrame = 0;

// Player
const player = {
  x: 0,
  y: 0,
  width: 60,
  height: 80,
  speed: 6,
  moving: false,
  direction: 0,
  boosting: false,
  boostTime: 0,
};

// Game objects
let obstacles = [];
let bubblegums = [];

// Road
let roadWidth = 0;
let roadOffset = 0;

// Simple colors for shapes (instead of images)
const COLORS = {
  player: "#FF7700",
  playerEars: "#FFAA00",
  playerHead: "#00AAFF",
  sunglasses: "#333333",
  bubble: "#FF88CC",
  road: "#555555",
  grass: "#55AA55",
  roadLines: "#FFFFFF",
  obstacle: "#FF0000",
  bubblegum: "#FF66CC",
};

// Initialize the game
function init() {
  // Get DOM elements
  canvas = document.getElementById("game-canvas");
  ctx = canvas.getContext("2d");
  titleScreen = document.getElementById("title-screen");
  gameUI = document.getElementById("game-ui");
  gameOverScreen = document.getElementById("game-over");
  startButton = document.getElementById("start-button");
  restartButton = document.getElementById("restart-button");

  // Add event listeners
  startButton.addEventListener("click", startGame);
  restartButton.addEventListener("click", restartGame);
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
  window.addEventListener("resize", resizeCanvas);

  // Set canvas size
  resizeCanvas();

  // Draw the start screen
  drawTitleScreen();
}

// Resize canvas
function resizeCanvas() {
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;

  // Update road width
  roadWidth = canvas.width * 0.7;

  // Update player starting position
  player.x = canvas.width / 2 - player.width / 2;
  player.y = canvas.height - player.height - 30;

  // If game is not running, redraw title screen
  if (!gameRunning && !gameOverScreen.style.display === "flex") {
    drawTitleScreen();
  }
}

// Start game
function startGame() {
  // Hide title screen, show game UI
  titleScreen.style.display = "none";
  gameUI.style.display = "block";

  // Reset game state
  score = 0;
  lives = 3;
  bubblegumCount = 0;
  gameSpeed = 5;
  gameFrame = 0;
  obstacles = [];
  bubblegums = [];
  player.boosting = false;
  player.boostTime = 0;

  // Reset player position
  player.x = canvas.width / 2 - player.width / 2;
  player.y = canvas.height - player.height - 30;

  // Update display
  updateScoreDisplay();

  // Start game loop
  gameRunning = true;
  gameLoop();
}

// Restart game
function restartGame() {
  // Hide game over screen, show game UI
  gameOverScreen.style.display = "none";
  gameUI.style.display = "block";

  // Reset game state
  score = 0;
  lives = 3;
  bubblegumCount = 0;
  gameSpeed = 5;
  gameFrame = 0;
  obstacles = [];
  bubblegums = [];
  player.boosting = false;
  player.boostTime = 0;

  // Reset player position
  player.x = canvas.width / 2 - player.width / 2;
  player.y = canvas.height - player.height - 30;

  // Update display
  updateScoreDisplay();

  // Start game loop
  gameRunning = true;
  gameLoop();
}

// Game over
function gameOver() {
  gameRunning = false;
  gameUI.style.display = "none";
  gameOverScreen.style.display = "flex";
  document.getElementById("final-score").textContent = score;
}

// Handle keyboard input
function handleKeyDown(e) {
  if (!gameRunning) return;

  if (e.key === "ArrowLeft") {
    player.moving = true;
    player.direction = -1;
  } else if (e.key === "ArrowRight") {
    player.moving = true;
    player.direction = 1;
  } else if (e.key === " " && bubblegumCount > 0) {
    // Space bar
    activateBoost();
  }
}

function handleKeyUp(e) {
  if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
    player.moving = false;
  }
}

// Activate boost
function activateBoost() {
  if (bubblegumCount > 0) {
    player.boosting = true;
    player.boostTime = 100; // boost lasts for 100 frames
    bubblegumCount--;
    gameSpeed = 10; // faster speed during boost
    updateScoreDisplay();
  }
}

// Update score display
function updateScoreDisplay() {
  document.getElementById("score").textContent = `Score: ${score}`;
  document.getElementById("lives").textContent = `Lives: ${lives}`;
  document.getElementById(
    "bubblegum"
  ).textContent = `Bubblegum: ${bubblegumCount}`;
}

// Add score
function addScore(points) {
  score += points;
  updateScoreDisplay();
}

// Create an obstacle
function createObstacle() {
  const roadX = (canvas.width - roadWidth) / 2;
  const obstacleWidth = 40;
  const obstacleHeight = 40;
  const x = roadX + Math.random() * (roadWidth - obstacleWidth);

  obstacles.push({
    x,
    y: -obstacleHeight,
    width: obstacleWidth,
    height: obstacleHeight,
  });
}

// Create bubblegum
function createBubblegum() {
  const roadX = (canvas.width - roadWidth) / 2;
  const bubblegumSize = 30;
  const x = roadX + Math.random() * (roadWidth - bubblegumSize);

  bubblegums.push({
    x,
    y: -bubblegumSize,
    width: bubblegumSize,
    height: bubblegumSize,
  });
}

// Update player
function updatePlayer() {
  // Move player
  if (player.moving) {
    player.x += player.direction * player.speed;
  }

  // Keep player within road
  const roadX = (canvas.width - roadWidth) / 2;
  if (player.x < roadX + 10) {
    player.x = roadX + 10;
  }
  if (player.x + player.width > roadX + roadWidth - 10) {
    player.x = roadX + roadWidth - player.width - 10;
  }

  // Update boost
  if (player.boosting) {
    player.boostTime--;
    if (player.boostTime <= 0) {
      player.boosting = false;
      gameSpeed = 5 + Math.floor(score / 500); // base speed plus difficulty increase
    }
  }
}

// Update obstacles
function updateObstacles() {
  for (let i = 0; i < obstacles.length; i++) {
    // Move obstacle
    obstacles[i].y += gameSpeed;

    // Check collision with player
    if (checkCollision(player, obstacles[i])) {
      // Collision!
      if (player.boosting) {
        // If player is boosting, destroy obstacle and gain points
        obstacles.splice(i, 1);
        addScore(10);
        i--;
      } else {
        // Otherwise, lose a life
        lives--;
        updateScoreDisplay();
        obstacles.splice(i, 1);
        i--;

        if (lives <= 0) {
          gameOver();
          return; // Exit the function to prevent further updates
        }
      }
    } else if (obstacles[i].y > canvas.height) {
      // Remove obstacles that go off screen
      obstacles.splice(i, 1);
      addScore(5); // Points for avoiding obstacle
      i--;
    }
  }

  // Add new obstacles
  if (gameFrame % 60 === 0) {
    // Adjust frequency as needed
    createObstacle();
  }
}

// Update bubblegums
function updateBubblegums() {
  for (let i = 0; i < bubblegums.length; i++) {
    // Move bubblegum
    bubblegums[i].y += gameSpeed;

    // Check collision with player
    if (checkCollision(player, bubblegums[i])) {
      // Collected!
      bubblegums.splice(i, 1);
      bubblegumCount++;
      addScore(15);
      updateScoreDisplay();
      i--;
    } else if (bubblegums[i].y > canvas.height) {
      // Remove bubblegums that go off screen
      bubblegums.splice(i, 1);
      i--;
    }
  }

  // Add new bubblegums less frequently than obstacles
  if (gameFrame % 120 === 0) {
    createBubblegum();
  }
}

// Check collision between two objects
function checkCollision(obj1, obj2) {
  return (
    obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y
  );
}

// Draw the title screen
function drawTitleScreen() {
  // Draw background
  ctx.fillStyle = COLORS.road;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw road
  drawRoad(); // No parameters needed for this function

  // Draw player character
  drawPlayer(canvas.width / 2 - 30, canvas.height / 2, true);
}

// Draw the player
function drawPlayer(x, y, onTitleScreen = false) {
  // Draw motorcycle (simplified)
  ctx.fillStyle = "#333333";
  ctx.fillRect(x, y + 40, 60, 20); // motorcycle body
  ctx.beginPath(); // wheel
  ctx.arc(x + 15, y + 70, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath(); // wheel
  ctx.arc(x + 45, y + 70, 10, 0, Math.PI * 2);
  ctx.fill();

  // Draw bunny ears
  ctx.fillStyle = COLORS.playerEars;
  ctx.fillRect(x + 20, y - 20, 8, 30); // left ear
  ctx.fillRect(x + 35, y - 20, 8, 30); // right ear

  // Draw body
  ctx.fillStyle = COLORS.player;
  ctx.fillRect(x + 15, y + 15, 30, 40); // torso

  // Draw fish head
  ctx.fillStyle = COLORS.playerHead;
  ctx.beginPath();
  ctx.arc(x + 30, y + 10, 20, 0, Math.PI * 2);
  ctx.fill();

  // Draw sunglasses
  ctx.fillStyle = COLORS.sunglasses;
  ctx.fillRect(x + 15, y + 5, 30, 8);

  // Draw bubble if boosting or on title screen
  if (player.boosting || onTitleScreen) {
    ctx.fillStyle = COLORS.bubble;
    ctx.beginPath();
    ctx.arc(x + 50, y + 10, 15, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Draw the road
function drawRoad() {
  const roadX = (canvas.width - roadWidth) / 2;

  // Draw road
  ctx.fillStyle = COLORS.road;
  ctx.fillRect(roadX, 0, roadWidth, canvas.height);

  // Draw grass
  ctx.fillStyle = COLORS.grass;
  ctx.fillRect(0, 0, roadX, canvas.height);
  ctx.fillRect(roadX + roadWidth, 0, roadX, canvas.height);

  // Draw road lines
  ctx.fillStyle = COLORS.roadLines;

  // Update road offset for animation
  roadOffset = (roadOffset + gameSpeed) % 40;

  // Draw center line
  for (let y = -roadOffset; y < canvas.height; y += 40) {
    ctx.fillRect(canvas.width / 2 - 2, y, 4, 20);
  }

  // Draw side lines
  for (let y = -roadOffset; y < canvas.height; y += 40) {
    ctx.fillRect(roadX, y, 5, 20);
    ctx.fillRect(roadX + roadWidth - 5, y, 5, 20);
  }
}

// Draw obstacles
function drawObstacles() {
  ctx.fillStyle = COLORS.obstacle;
  obstacles.forEach((obstacle) => {
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });
}

// Draw bubblegums
function drawBubblegums() {
  ctx.fillStyle = COLORS.bubblegum;
  bubblegums.forEach((bubblegum) => {
    ctx.beginPath();
    ctx.arc(
      bubblegum.x + bubblegum.width / 2,
      bubblegum.y + bubblegum.height / 2,
      bubblegum.width / 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
  });
}

// Main game loop
function gameLoop() {
  if (!gameRunning) return;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw road
  drawRoad();

  // Update game objects
  updatePlayer();
  updateObstacles();
  updateBubblegums();

  // Draw game objects
  drawObstacles();
  drawBubblegums();
  drawPlayer(player.x, player.y);

  // Increase difficulty over time
  if (gameFrame % 1000 === 0 && !player.boosting) {
    gameSpeed += 0.5;
  }

  // Increment game frame
  gameFrame++;

  // Continue the game loop
  requestAnimationFrame(gameLoop);
}
