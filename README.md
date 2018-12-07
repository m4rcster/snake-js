# Snake-js

Play the famous snake game in your terminal.

![alt text](https://user-images.githubusercontent.com/14793583/49650234-d8a48b00-fa2b-11e8-98af-81afbea999a9.png  =250x)

## Installation
`npm install --save @marcster/snake-js`

## Usage

```
let Snake = require('@marcster/snake-js');

// Snake(board width, board height, callback on loop end, speed in ms)
let snake = new Snake(10, 10, () => {
    let score = snake.score;
    // parse score to string
    snake.debug('' + score);
  }, 200);

```

### Options
 * Width - width of game area (will be multiplied by 2 since snake emoji requires 2 characters in terminal)
 * Height - height of game area
 * callback - function called during each loop after `draw()` but before `setTimeout`
 * speed - game speed in ms
