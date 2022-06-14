let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let snake = [];

snake.push([1, 1]);
snake.push([1, 2]);
snake.push([1, 3]);

const xsize = 10;
const ysize = 10;

const width = canvas.width;
const height = canvas.height;

const cellx = width / xsize;
const celly = height / ysize;

let grid = [];

for (i = 0; i < xsize; i++) {
    for (let j = 0; j < ysize; j++) {
        grid.push([i, j]);
    }
}

let direction = undefined;
let now = structuredClone(snake[snake.length - 1])

let apple = [2, 2];
const padding = 25;

function draw() {
    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.rect(0, 0, width, height);
    ctx.fill();

    let prev = snake[0];
    snake.slice(1).forEach(function(now) {
        ctx.beginPath();
        ctx.fillStyle = 'white';
        transition = [now[0] - prev[0], now[1] - prev[1]];
        if (transition[1] == 0) {
            ctx.rect(now[0] * cellx - padding * transition[0], now[1] * celly + padding / 2, cellx, celly - padding);
        } else {
            ctx.rect(now[0] * cellx + padding / 2, now[1] * celly - padding * transition[1], cellx - padding, celly);
        }
        prev = now;
        //ctx.rect(now[0] * cellx, now[1] * celly, cellx, celly);
        ctx.fill();
    })

    ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.rect(apple[0] * cellx, apple[1] * celly, cellx, celly);
    ctx.fill();

    window.requestAnimationFrame(draw);
}

window.addEventListener('keydown', function(e) {
    if ('key' in e) {
        if (e.key == 'w' && (snake[snake.length - 2][0] != now[0] && snake[snake.length - 2][1] != now[1] - 1)) direction = [0, -1];
        if (e.key == 'a' && (snake[snake.length - 2][0] != now[0] - 1 && snake[snake.length - 2][1] != now[1])) direction = [-1, 0];
        if (e.key == 's' && (snake[snake.length - 2][0] != now[0] && snake[snake.length - 2][1] != now[1] + 1)) direction = [0, 1];
        if (e.key == 'd' && (snake[snake.length - 2][0] != now[0] + 1 && snake[snake.length - 2][1] != now[1])) direction = [1, 0];
    }
});

draw()
let id = setInterval(function() {
    if (direction != undefined) {
        now = [now[0] + direction[0], now[1] + direction[1]];
        snake.push(now);

        if (now[0] == apple[0] && now[1] == apple[1]) {
            let choices = grid.filter(pos => !snake.some(snakepart => pos[0] == snakepart[0] && pos[1] == snakepart[1]));
            apple = choices[Math.floor(Math.random() * choices.length)]

            if (choices.length == 0) {
                console.log('win')
                clearInterval(id);
            }
        } else {
            snake.shift();
        }

        if (snake.slice(0, -1).some(snakepart => now[0] == snakepart[0] && now[1] == snakepart[1]) || Math.min(now[0], now[1]) < 0 || now[0] >= xsize || now[1] >= ysize) {
            console.log('lose')
            clearInterval(id);
        }
    }
}, 500)