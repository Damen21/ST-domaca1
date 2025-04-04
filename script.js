class player {
    constructor(x, y, imagesource, canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.x = x;
        this.y = y;
        this.basket = new Image();
        this.basket.src = imagesource;
        this.width = this.canvas.width * 0.1;
        this.height = this.canvas.height * 0.1;
    }

    draw() {

        this.ctx.drawImage(
            this.basket,
            this.x - this.width / 2, 
            this.y - this.height, 
            this.width,
            this.height
        );
    }
}


class Fruit {
    constructor(x, y, imagesource, canvas, sizeMultiplier, score) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.x = x;
        this.y = y;
        this.image = new Image();
        this.image.src = imagesource;

        this.width = this.canvas.width * sizeMultiplier;
        this.height = this.canvas.height * sizeMultiplier;

        this.speed = 2; 
        this.score = score; 
    }

    draw() {
        this.ctx.drawImage(
            this.image,
            this.x - this.width / 2, 
            this.y - this.height / 2, 
            this.width,
            this.height
        );
    }

    update() {
        this.y += this.speed;
        this.draw();
    }
}
class Blueberry extends Fruit {
    constructor(x, y, canvas) {
        super(x, y, "blueberry.png", canvas, 0.03, 100); 
    }
}

class Strawberry extends Fruit {
    constructor(x, y, canvas) {
        super(x, y, "strawberry.png", canvas, 0.04, 75); 
    }
}

class Apple extends Fruit {
    constructor(x, y, canvas) {
        super(x, y, "apple.png", canvas, 0.05, 50); 
    }
}

class Watermelon extends Fruit {
    constructor(x, y, canvas) {
        super(x, y, "watermelon.png", canvas, 0.07, 20);
    }
}


    let gameArea = document.querySelector(".game-area");
    let canvas = document.createElement("canvas");
    canvas.width = gameArea.offsetWidth; 
    canvas.height = gameArea.offsetHeight; 
    canvas.style.position = "absolute"; 
    canvas.style.top = "0";
    canvas.style.left = "0";
    gameArea.appendChild(canvas);
    let score = 0;
    let lives = 3;
    let ctx = canvas.getContext("2d");
    let kosara = new player(canvas.width / 2, canvas.height, "basket.png", canvas);
    let fruits = [];
    let playerSpeed = 10; 
    let keys = {}; 

    function spawnFruit() {
        let randomX = Math.random() * canvas.width; 
        let fruitClasses = [Blueberry, Strawberry, Apple, Watermelon];
        let RandomFruitClass = fruitClasses[Math.floor(Math.random() * fruitClasses.length)];
        let fruit = new RandomFruitClass(randomX, 0, canvas);
        fruits.push(fruit);
    }

    setInterval(spawnFruit, 2000);

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (keys["a"] || keys["A"]) {
            kosara.x = kosara.x - playerSpeed;
        }
        if (keys["d"] || keys["D"]) {
            kosara.x = kosara.x + playerSpeed;
        }

      
        fruits.forEach((fruit, index) => {
            fruit.update();

           
            if (
                fruit.x < kosara.x + kosara.width / 2 &&
                fruit.x > kosara.x - kosara.width / 2 &&
                fruit.y + fruit.height / 2 >= kosara.y - kosara.height
            ) {
                score += fruit.score; 
                fruits.splice(index, 1); 
            }


            if (fruit.y > canvas.height) {
                fruits.splice(index, 1); 
                lives--; 
            }
        });

        kosara.draw();

        ctx.font = "20px Arial";
        ctx.fillStyle = "black";
        ctx.fillText(`Score: ${score}`, 10, 30);
        ctx.fillText(`Lives: ${lives}`, 10, 60);

        if (lives > 0) {
            requestAnimationFrame(animate);
        } else {
            ctx.fillStyle = "red";
            ctx.font = "40px Arial";
            ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);

            setTimeout(() => {
                const playerName = prompt("Game Over! Enter your name:");
                if (playerName) {
                    saveScore(playerName, score);
                    updateLeaderboard();
                }
            }, 500);
        }
    }
    // Save the player's score to local storage
function saveScore(name, score) {
    const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboard.push({ name, score });
    leaderboard.sort((a, b) => b.score - a.score); // Sort by score in descending order
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}

// Update the leaderboard display
function updateLeaderboard() {
    const leaderboardContainer = document.querySelector(".leaderboard-container ul");
    const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboardContainer.innerHTML = leaderboard
        .slice(0, 10) // Show top 10 scores
        .map(entry => `<li>${entry.name}: ${entry.score} points</li>`)
        .join("");
}

// Initialize leaderboard on page load
updateLeaderboard();

    animate();

    window.addEventListener("resize", () => {
        canvas.width = gameArea.offsetWidth;
        canvas.height = gameArea.offsetHeight;
        kosara.width = canvas.width * 0.1;
        kosara.height = canvas.height * 0.1;
        kosara.x = canvas.width / 2;
        kosara.y = canvas.height;
        kosara.draw();
    });

    window.addEventListener("keydown", (event) => {
        keys[event.key] = true;
    });

    window.addEventListener("keyup", (event) => {
        keys[event.key] = false;
    });
