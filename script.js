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

document.addEventListener("DOMContentLoaded", () => {
    const gameArea = document.querySelector(".game-area");

    const canvas = document.createElement("canvas");
    canvas.width = gameArea.offsetWidth; 
    canvas.height = gameArea.offsetHeight; 
    canvas.style.position = "absolute"; 
    canvas.style.top = "0";
    canvas.style.left = "0";


    gameArea.appendChild(canvas);


    const kosara = new player(
        canvas.width / 2, 
        canvas.height, 
        "basket.png", 
        canvas
    );

  
    window.addEventListener("resize", () => {
        canvas.width = gameArea.offsetWidth;
        canvas.height = gameArea.offsetHeight;
        kosara.width = canvas.width * 0.1;
        kosara.height = canvas.height * 0.1;
        kosara.x = canvas.width / 2;
        kosara.y = canvas.height;
        kosara.draw();
    });
});