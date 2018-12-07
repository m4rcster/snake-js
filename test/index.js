let Snake = require('../src/snake');

// Snake(board width, board height, callback didupdateloop, speed in ms)
let snake = new Snake(12, 12, () => {
  let score = snake.score;
  // prints score on bottom right
  snake.debug('' + score);
}, 200);