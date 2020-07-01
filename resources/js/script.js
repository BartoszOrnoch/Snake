const SQUARE = 50;
const GAME_WIDTH = 1000;
const GAME_HEIGHT = 500;

class Snake {
    constructor() {
        this.head = [SQUARE * 2, SQUARE * 0];
        this.body = [[SQUARE * 0, SQUARE * 0], [SQUARE * 1, SQUARE * 0], this.head];
        this.horizontal = true;
    }

    move(dx, dy) {
        if (dy === 0 && this.horizontal === true) {
            return 0;
        }
        if (dx === 0 && this.horizontal !== true) {
            return 0;
        }

        const newHead = [this.head[0] + dx, this.head[1] + dy];
        if (newHead[0] >= GAME_WIDTH) { newHead[0] = 0; };
        if (newHead[1] >= GAME_HEIGHT) { newHead[1] = 0 };
        if (newHead[0] < 0) { newHead[0] = GAME_WIDTH - SQUARE };
        if (newHead[1] < 0) { newHead[1] = GAME_HEIGHT - SQUARE };
        this.body.shift();
        this.body.push(newHead);
        this.head = newHead;
        this.horizontal = !this.horizontal;

    }

}

var drawer = {
    draw_rects: function (squares, surface, size = SQUARE, color = 'red') {
        surface.fillStyle = color;
        for (let square of squares) {
            surface.beginPath();
            surface.rect(...square, SQUARE, SQUARE);
            surface.fill();
        }
    },
    fill_screen: function (surface, surfaceW, surfaceH, color = 'white') {
        surface.beginPath();
        surface.fillStyle = color;
        surface.rect(0, 0, surfaceW, surfaceH);
        surface.fill();
    },
}

var c = document.getElementById('myCanvas');
var ctx = c.getContext('2d');
snake = new Snake();
drawer.draw_rects(snake.body, ctx);


document.onkeydown = function (e) {
    switch (e.keyCode) {
        case 37:
            drawer.fill_screen(ctx, c.width, c.height);
            snake.move(-50, 0);
            drawer.draw_rects(snake.body, ctx)
            break;

        case 38:
            drawer.fill_screen(ctx, c.width, c.height);
            snake.move(0, -50);
            drawer.draw_rects(snake.body, ctx)
            break;
        case 39:
            drawer.fill_screen(ctx, c.width, c.height);
            snake.move(50, 0);
            drawer.draw_rects(snake.body, ctx)
            break;
        case 40:
            drawer.fill_screen(ctx, c.width, c.height);
            snake.move(0, 50);
            drawer.draw_rects(snake.body, ctx)
            break;
    }
};






