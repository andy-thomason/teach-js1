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
    
    // Draw top border
    ctx.strokeStyle = arena.lineColor;
    ctx.lineWidth = arena.lineWidth * 2;
    ctx.strokeRect(arena.x, arena.y, arena.width, arena.height);
}

// ===== GAME LOOP =====

// Main game loop - runs continuously
function gameLoop() {
    // Clear the canvas (black background)
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw everything
    drawArena();
    
    // Request the next frame
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
