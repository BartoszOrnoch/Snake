class Snake {
    constructor(widthlimit, heightlimit) {
        this.head = [4, 0];
        this.body = [[0, 0], [1, 0], [2, 0], [3, 0], this.head];
        this.newHead = [];
        this.horizontal = true;
        this.previous_move = [1, 0];
        this.isEating = false;
        this.isDead = false;
        this.widthLimit = widthlimit;
        this.heightLimit = heightlimit;
    }

    updateHead(dx, dy) {
        this.newHead = [this.head[0] + dx, this.head[1] + dy];
        if (this.newHead[0] >= this.widthLimit) { this.newHead[0] = 0; };
        if (this.newHead[1] >= this.heightLimit) { this.newHead[1] = 0 };
        if (this.newHead[0] < 0) { this.newHead[0] = this.widthLimit - 1 };
        if (this.newHead[1] < 0) { this.newHead[1] = this.heightLimit - 1 };

    }

    canMove(dx, dy) {
        this.updateHead(dx, dy);
        if (this.body.some(x => x[0] === this.newHead[0] && x[1] === this.newHead[1])) {
            this.isDead = true;
            return false;
        }
        this.previous_move = [dx, dy];
        return true;
    }

    move(dx, dy) {
        if (this.isEating) {
            this.isEating = false;
        }
        else {
            this.body.shift();
        }
        this.body.push(this.newHead);
        this.head = this.newHead;
        console.log(this.body);

    }
    checkIfEating(food_coords) {
        let hx, hy, fx, fy, rest;
        [hx, hy, fx, fy, ...rest] = [...this.newHead, ...food_coords];
        if (hx === fx && hy === fy) {
            this.isEating = true;
            console.log('zjadlem')
            return true;
        };
    }
}
class Board {
    constructor(width, height) {
        this.board = [];
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                this.board.push([j, i, 0]);
            }
        }
        this.foodCoords = [0, 0];
        this.boardwidth = width;
        this.boardheight = height;
    }
    fillBoard(arr) {
        for (let element of arr) {
            let col = element[0];
            let row = element[1];
            this.board[col + row * this.boardwidth][2] = 1;
        }

    }
    clearBoard() {
        for (let i = 0; i < this.board.length; i++) {
            if (this.board[i][2] === 1) {
                this.board[i][2] = 0;
            }
        }
    }
    placeFood() {
        const free_space = this.board.filter(element => element[2] === 0);
        this.foodCoords = free_space[Math.floor(Math.random() * free_space.length)];
        this.board[this.foodCoords[0] + this.foodCoords[1] * this.boardwidth][2] = 2;
    }

    draw(surface, size, colors) {
        for (let element of this.board) {
            let col, row, color;
            [col, row, color] = [...element];
            surface.fillStyle = colors[color];
            surface.beginPath();
            surface.rect(col * size, row * size, size, size);
            //console.log([col * size, row * size, size, size]);
            surface.fill();
        }
    }
}

class Game {

    constructor(width, height, square, cavas, speed) {
        this.squareSize = square;
        this.width = width;
        this.height = height;
        this.colors = ['white', 'red', 'green'];
        this.surface = canvas.getContext('2d');
        this.gameScoreBlock = document.getElementById('score');
        this.gameTimeBlock = document.getElementById('time');
        this.gameScore = 0;
        this.gameTime = 0;
        this.gameOver = false;
    }

    startGame() {
        this.snake = new Snake(this.width, this.height);
        this.board = new Board(this.width, this.height);
        this.gameTimer = window.setInterval(() => { this.gameTime++, this.gameTimeBlock.innerHTML = this.gameTime }, 1000);
        this.moveTimer = window.setInterval(() => { if (this.snake.canMove(...this.snake.previous_move)) { this.moveSnake() } }, 500);
        this.board.placeFood();
        this.drawGame();

    }
    drawGame() {
        this.board.clearBoard();
        this.board.fillBoard(this.snake.body);
        this.board.draw(this.surface, this.squareSize, this.colors);
    }
    moveSnake() {
        if (this.snake.checkIfEating(this.board.foodCoords)) {
            this.board.placeFood();
            this.updateScore();
        };
        this.snake.move();
        this.drawGame();
        window.clearInterval(this.moveTimer);
        this.moveTimer = window.setInterval(() => { if (this.snake.canMove(...this.snake.previous_move)) { this.moveSnake() } }, 500);
    }

    handleInput(keyCode) {
        const directions = {
            37: [-1, 0],
            38: [0, -1],
            39: [1, 0],
            40: [0, 1]
        };
        if (Object.keys(directions).includes(keyCode.toString())) {
            if ((keyCode === 37 || keyCode == 39) && this.snake.horizontal) {
                console.log('cant_move');
                return false;
            }
            if ((keyCode === 38 || keyCode == 40) && !this.snake.horizontal) {
                console.log('cant_move');
                return false;
            }
            this.snake.horizontal = !this.snake.horizontal;
            if (this.snake.canMove(...directions[keyCode])) {
                this.moveSnake();
            }
            else {
                console.log('gameOver')
            }
        }
        return false;
    }
    updateScore() {
        this.gameScore += 1;
        this.gameScoreBlock.innerHTML = this.gameScore;
    }
    stopGameTime() {
        window.clearInteravl(this.gameTimer);
    }
}

var gameDiv = document.getElementById('gameDiv');
var menuDiv = document.getElementById('mainMenu');
var startbutton = document.getElementById("startButton");
var optionsButton = document.getElementById("optionsButton");
var gameSizeS = document.getElementById("gameSizeS");
var gameSizeM = document.getElementById("gameSizeM");
var gameSizeL = document.getElementById("gameSizeL");
var canvas = document.getElementById('myCanvas');



// gameSizeS.onclick = function () {
//     width = 10;
//     height = 5;
//     canvas.style.witdh = width * square;
//     canvas.style.height = height * square;
// }

// gameSizeM.onclick = function () {
//     width = 20;
//     height = 10;
//     canvas.style.witdh = 400;
//     canvas.style.height = 200;
// }
var width = 20;
var height = 10;
var square = 50;

gameSizeS.onclick = function () {
    width = 10;
    height = 5;
    square = 50;
    canvas.width = width * square;
    canvas.height = height * square;
}

gameSizeM.onclick = function () {
    width = 14;
    height = 7;
    square = 50;
    canvas.width = width * square;
    canvas.height = height * square;
}

gameSizeL.onclick = function () {
    width = 20;
    height = 10;
    square = 50;
    canvas.width = width * square;
    canvas.height = height * square;
}


startbutton.onclick = function () {
    gameDiv.style.display = 'block';
    menuDiv.style.display = 'none';
    game = new Game(width, height, square, 0);
    game.startGame();
};

document.addEventListener('keydown', function (event) {
    game.handleInput(event.keyCode);
});





