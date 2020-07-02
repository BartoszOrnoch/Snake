const SQUARE = 50;
const GAME_WIDTH = 20;
const GAME_HEIGHT = 10;
const COLORS = ['white', 'red', 'green']


class Board {
    constructor(width, height) {
        this.board = [];
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                this.board.push([j, i, 0]);
            }
        }
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
        const food_coords = free_space[Math.floor(Math.random() * free_space.length)];
        this.board[food_coords[0] + food_coords[1] * 20][2] = 2;
        return food_coords;
    }

    draw(surface, size = SQUARE) {
        for (let element of this.board) {
            let col, row, color;
            [col, row, color] = [...element];
            surface.fillStyle = COLORS[color];
            surface.beginPath();
            surface.rect(col * size, row * size, size, size);
            surface.fill();
        }
    }
}

class Snake {
    directions = {
        37: [-1, 0],
        38: [0, -1],
        39: [1, 0],
        40: [0, 1]
    };
    constructor() {
        this.head = [4, 0];
        this.body = [[0, 0], [1, 0], [2, 0], [3, 0], this.head];
        this.newHead = [];
        this.horizontal = true;
        this.previous_move = this.directions[39];
        this.isEating = false;
        this.isDead = false;
    }

    updateHead(dx, dy) {
        this.newHead = [this.head[0] + dx, this.head[1] + dy];
        if (this.newHead[0] >= GAME_WIDTH) { this.newHead[0] = 0; };
        if (this.newHead[1] >= GAME_HEIGHT) { this.newHead[1] = 0 };
        if (this.newHead[0] < 0) { this.newHead[0] = GAME_WIDTH - 1 };
        if (this.newHead[1] < 0) { this.newHead[1] = GAME_HEIGHT - 1 };

    }

    canMove(dx, dy, manual = true) {
        // if (manual) {
        //     if (dx === this.previous_move[0] || dx === this.previous_move[0] * -1) {
        //         return false;
        //     }
        // }
        this.updateHead(dx, dy);
        if (this.body.some(x => x[0] === this.newHead[0] && x[1] === this.newHead[1])) {
            this.dead = true;
            return false;
        }
        this.previous_move = [dx, dy];
        return true;
    }

    move() {
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
        return false;
    }

}


var c = document.getElementById('myCanvas');
var ctx = c.getContext('2d');
snake = new Snake();
board = new Board(GAME_WIDTH, GAME_HEIGHT);
board.fillBoard(snake.body);
let food = board.placeFood();
board.draw(ctx);


document.onkeydown = function (e) {
    console.log(snake.directions[e.keyCode]);
    let direction = snake.directions[e.keyCode];
    if (snake.canMove(...direction)) {
        if (snake.checkIfEating(food)) {
            food = board.placeFood();
        };
        snake.move();
    }
    board.clearBoard();
    board.fillBoard(snake.body);
    board.draw(ctx);
}






