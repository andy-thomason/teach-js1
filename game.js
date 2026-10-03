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
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 8,
    velocityX: 5,
    velocityY: 5,
    color: '#fff'
};

// ===== PADDLE SETUP =====
const paddle = {
    width: 120,
    height: 14,
    x: (canvas.width - 120) / 2,
    y: canvas.height - 30,
    speed: 8,
    color: '#fff'
};

const keys = {
    left: false,
    right: false
};

// ===== BLOCKS SETUP =====
const blocks = [];

function createBlocks() {
    const rows = 4;
    const cols = 8;
    const blockWidth = 80;
    const blockHeight = 20;
    const gap = 10;
    const topMargin = 40;
    const leftMargin = 50;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            blocks.push({
                x: leftMargin + col * (blockWidth + gap),
                y: topMargin + row * (blockHeight + gap),
                width: blockWidth,
                height: blockHeight,
                color: `hsl(${row * 35 + 200}, 80%, 60%)`,
                alive: true
            });
        }
    }
}

createBlocks();

// ===== DRAWING FUNCTIONS =====

// Function to draw the arena (the game boundary and center line)
function drawArena() {
    ctx.strokeStyle = arena.lineColor;
    ctx.lineWidth = arena.lineWidth;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

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

// Function to draw the paddle
function drawPaddle() {
    ctx.fillStyle = paddle.color;
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// Function to draw all the blocks
function drawBlocks() {
    blocks.forEach((block) => {
        if (!block.alive) return;

        ctx.fillStyle = block.color;
        ctx.fillRect(block.x, block.y, block.width, block.height);

        ctx.strokeStyle = '#000';
        ctx.strokeRect(block.x, block.y, block.width, block.height);
    });
}

// ===== INPUT HANDLERS =====

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') {
        keys.left = true;
    }
    if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') {
        keys.right = true;
    }
});

window.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') {
        keys.left = false;
    }
    if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') {
        keys.right = false;
    }
});

canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = ((event.clientX - rect.left) / rect.width) * canvas.width;
    paddle.x = mouseX - paddle.width / 2;
    paddle.x = clamp(paddle.x, 0, canvas.width - paddle.width);
});

// ===== UPDATE FUNCTIONS =====

function updatePaddle() {
    if (keys.left) {
        paddle.x -= paddle.speed;
    }
    if (keys.right) {
        paddle.x += paddle.speed;
    }

    paddle.x = clamp(paddle.x, 0, canvas.width - paddle.width);
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.velocityX = 5;
    ball.velocityY = 5;
}

function handlePaddleCollision() {
    const paddleLeft = paddle.x;
    const paddleRight = paddle.x + paddle.width;
    const paddleTop = paddle.y;
    const paddleBottom = paddle.y + paddle.height;

    const hitPaddle =
        ball.y + ball.radius >= paddleTop &&
        ball.y - ball.radius <= paddleBottom &&
        ball.x >= paddleLeft &&
        ball.x <= paddleRight &&
        ball.velocityY > 0;

    if (hitPaddle) {
        ball.y = paddleTop - ball.radius;
        ball.velocityY = -Math.abs(ball.velocityY);

        // Make the angle depend on where the ball hits the paddle
        const relativeHit = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
        ball.velocityX = relativeHit * 7;
    }
}

function handleBlockCollisions() {
    for (const block of blocks) {
        if (!block.alive) continue;

        const insideX = ball.x + ball.radius > block.x && ball.x - ball.radius < block.x + block.width;
        const insideY = ball.y + ball.radius > block.y && ball.y - ball.radius < block.y + block.height;

        if (!insideX || !insideY) continue;

        block.alive = false;

        const overlapLeft = (ball.x + ball.radius) - block.x;
        const overlapRight = (block.x + block.width) - (ball.x - ball.radius);
        const overlapTop = (ball.y + ball.radius) - block.y;
        const overlapBottom = (block.y + block.height) - (ball.y - ball.radius);

        const smallestOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

        if (smallestOverlap === overlapLeft || smallestOverlap === overlapRight) {
            ball.velocityX *= -1;
        } else {
            ball.velocityY *= -1;
        }

        break;
    }
}

function updateBall() {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    if (ball.y - ball.radius < arena.y) {
        ball.y = arena.y + ball.radius;
        ball.velocityY = -ball.velocityY;
    }

    if (ball.y + ball.radius > arena.height) {
        handlePaddleCollision();

        if (ball.y + ball.radius > arena.height) {
            resetBall();
        }
    }

    if (ball.x - ball.radius < arena.x) {
        ball.x = arena.x + ball.radius;
        ball.velocityX = -ball.velocityX;
    }

    if (ball.x + ball.radius > arena.width) {
        ball.x = arena.width - ball.radius;
        ball.velocityX = -ball.velocityX;
    }

    if (ball.y - ball.radius < arena.y) {
        ball.y = arena.y + ball.radius;
        ball.velocityY = -ball.velocityY;
    }

    handleBlockCollisions();
}

// ===== GAME LOOP =====

function gameLoop() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    updatePaddle();
    updateBall();

    drawArena();
    drawBlocks();
    drawPaddle();
    drawBall();

    requestAnimationFrame(gameLoop);
}

gameLoop();
