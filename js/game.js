// Jump'n'Run Game Engine
window.JumpGame = (function() {
    let canvas, ctx;
    let gameRunning = false;
    let score = 0;
    let gameCallback;
    
    // Player
    const player = {
        x: 100,
        y: 0,
        width: 40,
        height: 40,
        velocityY: 0,
        jumping: false,
        gravity: 0.6,
        jumpPower: -12,
        color: '#ff6b9d'
    };
    
    // Obstacles
    const obstacles = [];
    const obstacleSpeed = 5;
    const obstacleSpawnRate = 100; // frames
    let frameCount = 0;
    
    // Ground
    const groundY = 400;
    
    function init() {
        canvas = document.getElementById('game-canvas');
        ctx = canvas.getContext('2d');
        
        // Set canvas size
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Touch/Click to jump
        canvas.addEventListener('touchstart', jump);
        canvas.addEventListener('click', jump);
    }
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    function start(callback) {
        gameCallback = callback;
        reset();
        init();
        gameRunning = true;
        gameLoop();
    }
    
    function reset() {
        score = 0;
        frameCount = 0;
        obstacles.length = 0;
        player.y = groundY - player.height;
        player.velocityY = 0;
        player.jumping = false;
        updateScore();
    }
    
    function jump() {
        if (!player.jumping) {
            player.velocityY = player.jumpPower;
            player.jumping = true;
        }
    }
    
    function updateScore() {
        document.getElementById('score').textContent = `Score: ${score}`;
    }
    
    function spawnObstacle() {
        const types = ['wurst', 'polizei'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        obstacles.push({
            x: canvas.width,
            y: groundY - 30,
            width: 40,
            height: 30,
            type: type,
            color: type === 'wurst' ? '#8b4513' : '#0066cc'
        });
    }
    
    function updatePlayer() {
        // Apply gravity
        player.velocityY += player.gravity;
        player.y += player.velocityY;
        
        // Ground collision
        if (player.y >= groundY - player.height) {
            player.y = groundY - player.height;
            player.velocityY = 0;
            player.jumping = false;
        }
    }
    
    function updateObstacles() {
        for (let i = obstacles.length - 1; i >= 0; i--) {
            obstacles[i].x -= obstacleSpeed;
            
            // Remove off-screen obstacles
            if (obstacles[i].x + obstacles[i].width < 0) {
                obstacles.splice(i, 1);
                score++;
                updateScore();
                
                // Check win condition
                if (score >= 10) {
                    endGame(true);
                }
                continue;
            }
            
            // Collision detection
            if (checkCollision(player, obstacles[i])) {
                endGame(false);
            }
        }
    }
    
    function checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    function drawPlayer() {
        // Draw simple pixel-style player (Topflappen)
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.width, player.height);
        
        // Border
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(player.x, player.y, player.width, player.height);
        
        // Eyes
        ctx.fillStyle = '#000';
        ctx.fillRect(player.x + 10, player.y + 12, 6, 6);
        ctx.fillRect(player.x + 24, player.y + 12, 6, 6);
        
        // Smile
        ctx.fillRect(player.x + 12, player.y + 26, 16, 4);
    }
    
    function drawObstacles() {
        obstacles.forEach(obs => {
            ctx.fillStyle = obs.color;
            ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
            
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
            
            // Type indicator
            ctx.fillStyle = '#fff';
            ctx.font = '12px "Press Start 2P"';
            ctx.textAlign = 'center';
            const text = obs.type === 'wurst' ? '🌭' : '👮';
            ctx.fillText(text, obs.x + obs.width / 2, obs.y + obs.height / 2 + 4);
        });
    }
    
    function drawGround() {
        ctx.fillStyle = '#2a5934';
        ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);
        
        // Ground pattern
        ctx.strokeStyle = '#1a3a24';
        ctx.lineWidth = 2;
        for (let x = 0; x < canvas.width; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, groundY);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
    }
    
    function drawSky() {
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#87ceeb');
        gradient.addColorStop(1, '#f0e68c');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    function draw() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw sky
        drawSky();
        
        // Draw ground
        drawGround();
        
        // Draw game objects
        drawPlayer();
        drawObstacles();
    }
    
    function gameLoop() {
        if (!gameRunning) return;
        
        frameCount++;
        
        // Spawn obstacles
        if (frameCount % obstacleSpawnRate === 0) {
            spawnObstacle();
        }
        
        // Update
        updatePlayer();
        updateObstacles();
        
        // Draw
        draw();
        
        // Continue loop
        requestAnimationFrame(gameLoop);
    }
    
    function endGame(won) {
        gameRunning = false;
        
        // Show result
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = won ? '#4ade80' : '#ef4444';
        ctx.font = '20px "Press Start 2P"';
        ctx.textAlign = 'center';
        
        const message = won 
            ? 'GESCHAFFT!' 
            : 'GAME OVER';
        
        ctx.fillText(message, canvas.width / 2, canvas.height / 2 - 40);
        
        ctx.fillStyle = '#fff';
        ctx.font = '14px "Press Start 2P"';
        ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2);
        
        if (won) {
            ctx.fillStyle = '#ff6b9d';
            ctx.fillText('Regenbogen-Skin', canvas.width / 2, canvas.height / 2 + 40);
            ctx.fillText('freigeschaltet! 🌈', canvas.width / 2, canvas.height / 2 + 70);
        }
        
        // Continue after delay
        setTimeout(() => {
            if (gameCallback) {
                gameCallback(score);
            }
        }, 3000);
    }
    
    return {
        start: start
    };
})();
