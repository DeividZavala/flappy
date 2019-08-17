const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let frames = 0;
let gravity = 0.1;
const pipes = [];
let interval;
let score = 0;
let audio = new Audio();
audio.loop = true;
audio.src =
  "https://ia600702.us.archive.org/25/items/FailRecorderMissionImpossibleThemesong/Fail%20Recorder_%20Mission%20Impossible%20Themesong.mp3";

class Flappy {
  constructor(width, height) {
    this.x = 10;
    this.y = 150;
    this.vy = 2;
    this.userPull = 0;
    this.width = width;
    this.height = height;
    this.image = new Image();
    this.image.src = "images/flappy.png";
  }

  collision(item) {
    return (
      this.x < item.x + item.width &&
      this.x + this.width > item.x &&
      this.y < item.y + item.height &&
      this.y + this.height > item.y
    );
  }

  draw() {
    this.vy = this.vy + (gravity - this.userPull);
    if (this.y + this.height < canvas.height) {
      this.y += this.vy;
    } else {
      gameOver();
    }
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

class Background {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.width = canvas.width;
    this.height = canvas.height;
    this.image = new Image();
    this.image.src = "images/bg.png";
  }

  draw() {
    this.x--;
    if (this.x < -canvas.width) this.x = 0;
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);

    ctx.drawImage(
      this.image,
      this.x + canvas.width,
      this.y,
      this.width,
      this.height
    );
  }
}

class Pipe {
  constructor(height, pos, y) {
    this.x = canvas.width;
    this.y = y;
    this.height = height;
    this.width = 60;
    this.image = new Image();
    this.image.src =
      pos === "top" ? "images/obstacle_top.png" : "images/obstacle_bottom.png";
  }

  draw() {
    this.x--;
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

const flappy = new Flappy(40, 40);
const background = new Background();

function generatePipes() {
  if (!(frames % 200 === 0)) return;
  const height = Math.floor(Math.random() * canvas.height * 0.5 + 30);
  const pipe1 = new Pipe(height, "top", 0);
  const pipe2 = new Pipe(canvas.height - height - 140, null, height + 140);
  pipes.push(pipe1);
  pipes.push(pipe2);
}

function drawPipe() {
  pipes.forEach(pipe => {
    if (pipe.x + pipe.width < 0) {
      score += 2;
      pipes.splice(0, 2);
    }
    pipe.draw();
    if (flappy.collision(pipe)) gameOver();
  });
}

function update() {
  frames++;
  ctx.font = "35px Arial";
  background.draw();
  generatePipes();
  drawPipe();
  flappy.draw();
  ctx.fillText(score, 620, 50);
}

function gameOver() {
  document.querySelector("button").disabled = false;
  audio.pause();
  ctx.fillText("GameOver morro", 235, 200);
  clearInterval(interval);
  interval = undefined;
}

function start() {
  document.querySelector("button").disabled = true;
  audio.play();
  interval = setInterval(update, 1000 / 60);
}

document.onkeydown = function(e) {
  if (e.keyCode == 32) {
    flappy.userPull = 0.3;
  }
};

document.onkeyup = function(e) {
  if (e.keyCode == 32) {
    flappy.userPull = 0;
  }
};

document.querySelector("button").onclick = start;
