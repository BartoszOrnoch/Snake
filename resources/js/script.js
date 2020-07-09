class Snake {
    constructor() {
        this.head = [4, 0];
        this.body = [[0, 0], [1, 0], [2, 0], [3, 0], this.head];
        this.newHead = [];
        this.horizontal = true;
        this.previous_move = [1, 0];
        this.isEating = false;
        this.isDead = false;
    }

    updateHead(dx, dy) {
        this.newHead = [this.head[0] + dx, this.head[1] + dy];
        if (this.newHead[0] >= game.width) { this.newHead[0] = 0; };
        if (this.newHead[1] >= game.height) { this.newHead[1] = 0 };
        if (this.newHead[0] < 0) { this.newHead[0] = game.width - 1 };
        if (this.newHead[1] < 0) { this.newHead[1] = game.height - 1 };

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
        this.foodCoords = [0, 0]
    }
    fillBoard(arr) {
        for (let element of arr) {
            let col = element[0];
            let row = element[1];
            this.board[col + row * 20][2] = 1;
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
        this.board[this.foodCoords[0] + this.foodCoords[1] * 20][2] = 2;
    }

    draw(surface, size) {
        for (let element of this.board) {
            let col, row, color;
            [col, row, color] = [...element];
            surface.fillStyle = game.colors[color];
            surface.beginPath();
            surface.rect(col * size, row * size, size, size);
            surface.fill();
        }
    }
}



class Game {

    constructor() {
        this.squareSize = 50;
        this.width = 20;
        this.height = 10;
        this.colors = ['white', 'red', 'green'];
        this.snake = new Snake();
        this.board = new Board(this.width, this.height);
        this.canvas = document.getElementById('myCanvas');
        this.surface = this.canvas.getContext('2d');
        this.gameScoreBlock = document.getElementById('score');
        this.gameTimeBlock = document.getElementById('time');
        this.gameScore = 0;
        this.gameTime = 0;
        this.gameOver = false;
        this.gameTimer = window.setInterval(() => { this.gameTime++, this.gameTimeBlock.innerHTML = this.gameTime }, 1000);
        this.moveTimer = window.setInterval(() => { if (this.snake.canMove(...this.snake.previous_move)) { this.moveSnake() } }, 500);

    }

    drawGame() {
        this.board.clearBoard();
        this.board.fillBoard(this.snake.body);
        this.board.draw(this.surface, this.squareSize);
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



game = new Game();
game.board.placeFood();
game.drawGame();

document.addEventListener('keydown', function (event) {
    game.handleInput(event.keyCode);
});





