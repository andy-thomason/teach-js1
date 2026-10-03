// Get the canvas and its drawing context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ===== ARENA SETUP =====
// Define the game arena (the playing field)
const arena = {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height,
    lineWidth: 2,
    lineColor: '#fff'
};

// ===== BALL SETUP =====
// Define the ball object
const ball = {
    x: canvas.width / 2,           // Start in the center horizontally
    y: canvas.height / 2,          // Start in the center vertically
    radius: 8,                      // Ball size
    velocityX: 5,                   // How fast the ball moves horizontally
    velocityY: 5,                   // How fast the ball moves vertically
    color: '#fff'                   // White color
};

// ===== DRAWING FUNCTIONS =====

// Function to draw the arena (the game boundary and center line)
function drawArena() {
    // Draw the center line (dashed)
    ctx.strokeStyle = arena.lineColor;
    ctx.lineWidth = arena.lineWidth;
    ctx.setLineDash([10, 10]); // 10 pixels on, 10 pixels off
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]); // Reset line dash
    
    // Draw border (white rectangle around the arena)
    ctx.strokeStyle = arena.lineColor;
    ctx.lineWidth = arena.lineWidth * 2;
    ctx.strokeRect(arena.x, arena.y, arena.width, arena.height);
}

// Function to draw the ball
function drawBall() {
    ctx.fillStyle = ball.color;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
}

// ===== UPDATE FUNCTIONS =====

// Function to update the ball position and handle bouncing
function updateBall() {
    // Move the ball
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    
    // Bounce off top and bottom walls
    if (ball.y - ball.radius < arena.y) {
        // Hit top wall - reverse vertical direction
        ball.y = arena.y + ball.radius;
        ball.velocityY = -ball.velocityY;
    }
    if (ball.y + ball.radius > arena.height) {
        // Hit bottom wall - reverse vertical direction
        ball.y = arena.height - ball.radius;
        ball.velocityY = -ball.velocityY;
    }
    
    // Bounce off left and right walls
    if (ball.x - ball.radius < arena.x) {
        // Hit left wall - reverse horizontal direction
        ball.x = arena.x + ball.radius;
        ball.velocityX = -ball.velocityX;
    }
    if (ball.x + ball.radius > arena.width) {
        // Hit right wall - reverse horizontal direction
        ball.x = arena.width - ball.radius;
        ball.velocityX = -ball.velocityX;
    }
}

// ===== GAME LOOP =====

// Main game loop - runs continuously
function gameLoop() {
    // Clear the canvas (black background)
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Update game logic
    updateBall();
    
    // Draw everything
    drawArena();
    drawBall();
    
    // Request the next frame
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
