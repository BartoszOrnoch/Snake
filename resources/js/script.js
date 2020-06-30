
const SQUARE = 50;
var head = [100, 0, 50, 50];
var middle = [50, 0, 50, 50];
var tail = [0, 0, 50, 50];

var c = document.getElementById('myCanvas');
var ctx = c.getContext('2d');

const snake = [tail, middle, head];

function draw_rect(square) {
    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.rect(...square);
    ctx.fill();
}

function fill_screen() {
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.rect(0, 0, c.width, c.height)
    ctx.fill();
}

function draw_snake() {
    for (let element of snake) {
        draw_rect(element);
    }
}

function update_snake(arr, shift_x, shift_y) {
    const new_head = [arr[arr.length - 1][0] + shift_x, arr[arr.length - 1][1] + shift_y, SQUARE, SQUARE];
    arr.shift();
    arr.push(new_head)
}

draw_snake();
document.onkeydown = function (e) {
    switch (e.keyCode) {
        case 37:
            fill_screen();
            update_snake(snake, -50, 0);
            draw_snake();
            console.log(snake);
            break;

        case 38:
            fill_screen();
            update_snake(snake, 0, -50);
            draw_snake();
            console.log(snake);
            break;
        case 39:
            fill_screen();
            update_snake(snake, 50, 0);
            draw_snake();
            console.log(snake);
            break;
        case 40:
            fill_screen();
            update_snake(snake, 0, 50);
            draw_snake();
            console.log(snake);
            break;
    }
};






