const Interface = require('./interface');
const Box = require('./box');

class Snake {
  constructor(width, height, cb, speed = 200) {
    this.grid = { x: 2, y: 1 };
    this.ui = new Interface();

    let center = this.ui.center;
    this.box = new Box(center.x, center.y, width * 2, height);

    this.cb = cb;

    this.speed = speed;
    this.frame = undefined;
    this.isOver = false;

    this.reset();

    this.ui.onkey('left', () => this.handleKey('left'));
    this.ui.onkey('up', () => this.handleKey('up'));
    this.ui.onkey('right', () => this.handleKey('right'));
    this.ui.onkey('down', () => this.handleKey('down'));
    this.ui.onkey('space', () => this.handleKey('space'));
  }

  loop() {
    if(this.isOver) {
      return;
    }

    let snake = this.snake;
    let apple = this.apple;
    let ui = this.ui;
    let box = this.box;
    let grid = this.grid;

    // move snake
    snake.x += snake.dx;
    snake.y += snake.dy;

    if(!box.contains(snake.x, snake.y)) {
      return this.gameOver();
    }

    // add new cell
    snake.cells.unshift({ x: snake.x, y: snake.y });

    // remove cells as we move away from them
    if(snake.cells.length > snake.maxCells) {
      snake.cells.pop();
    }

    // check collision
    snake.cells.forEach((cell, index) => {
      // eat apple
      if(cell.x === apple.x && cell.y === apple.y) {
        snake.maxCells++;
        this.spawn();
      }
      // eat self
      for(var i = index + 1; i < snake.cells.length; i++) {
        // snake occupies same space as a body part. reset game
        if(cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
          return this.gameOver();
        }
      }
    })

    this.draw();
    this.frame = setTimeout(this.loop.bind(this), this.speed);
  }

  get score() {
    return this.snake.maxCells - 4;
  }

  draw() {
    this.ui.clear();
    this.box.draw(this.ui.cursor);

    // draw apple
    let apple = this.apple;
    this.ui.cursor.goto(apple.x, apple.y).write(apple.sprite);

    // draw snake
    let snake = this.snake;
    snake.cells.forEach(cell => {
      this.ui.cursor.goto(cell.x, cell.y).write(snake.sprite);
    })

    // draw score
    {
      let text = '🏆 : ' + this.score;
      let x = this.ui.center.x - text.length / 2;
      let y = this.box.top - 2;
      this.ui.cursor.goto(x, y).write(text);
    }

    if(this.isOver) {
      let text = 'GAME OVER'
      let x = this.ui.center.x - text.length / 2;
      let y = this.ui.center.y - 1;
      this.ui.cursor.goto(x, y).write(text);
    }

    if(!this.frame && !this.isOver) {
      let text = 'Press space to ▶️  or ⏸';
      let x = this.ui.center.x - text.length / 2;
      let y = this.ui.center.y + 1;
      this.ui.cursor.goto(x, y).write(text);
    }
  }

  start() {
    if(this.isOver) {
      this.reset();
    } else if(this.frame === undefined) {
      this.loop();
    }
  }

  pause() {
    this.debug('pause');
    clearTimeout(this.frame);
    this.frame = undefined;
  }

  gameOver() {
    this.pause();
    this.isOver = true;
    this.snake.sprite = '💀';
    this.draw();
    this.cb('dead');
  }

  reset() {
    this.isOver = false;

    let x = Math.floor(this.ui.center.x / 2) * 2;
    let y = Math.floor(this.ui.center.y / 2) * 2;

    this.snake = {
      x: x,
      y: y,

      dx: this.grid.x,
      dy: 0,

      cells: [{ x, y }],
      sprite: '🐍',
      maxCells: 4
    };

    this.spawn();
    this.draw();
  }

  spawn() {
    let xMin = this.box.left;
    let xMax = this.box.right - this.grid.x;
    let yMin = this.box.top + this.grid.y;
    let yMax = this.box.bottom - this.grid.y;

    this.apple = {
      x: Math.ceil(this.getRandomInt(xMin, xMax) / 2) * 2,
      y: Math.ceil(this.getRandomInt(yMin, yMax)),
      sprite: '🍎'
    };
  }

  handleKey(key) {
    if(key === 'left' && this.snake.dx === 0) {
      this.snake.dx = -this.grid.x;
      this.snake.dy = 0;
      return;
    }
    if(key === 'up' && this.snake.dy === 0) {
      this.snake.dx = 0;
      this.snake.dy = -this.grid.y;
      return;
    }
    if(key === 'right' && this.snake.dx === 0) {
      this.snake.dx = this.grid.x;
      this.snake.dy = 0;
      return;
    }
    if(key === 'down' && this.snake.dy === 0) {
      this.snake.dx = 0;
      this.snake.dy = this.grid.y;
      return;
    }
    if(key === 'space' && !this.playing) {
      this.start();
      return;
    }
    if(key === 'space' && this.playing) {
      this.pause();
      return;
    }
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  debug(text) {
    this.ui.cursor.goto(0, this.ui.height).write(text);
  }
}

module.exports = Snake;