const boxHorizontal = '━';
const boxVertical = '┃';
const boxTopLeft = '┏';
const boxTopRight = '┓';
const boxBottomLeft = '┗';
const boxBottomRight = '┛';

class Box {
  constructor(x, y, width, height, padding = 1) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.padding = padding;
  }

  get left() {
    return Math.ceil(this.x - this.width / 2);
  }

  get right() {
    return Math.ceil(this.x + this.width / 2);
  }

  get top() {
    return Math.ceil(this.y - this.height / 2);
  }

  get bottom() {
    return Math.ceil(this.y + this.height / 2);
  }

  contains(x, y) {
    return (x >= this.left &&
      x < this.right &&
      y >= this.top &&
      y < this.bottom) ? true : false;
  }

  draw(cursor) {
    let top = this.top - this.padding;
    let bottom = this.bottom + this.padding;
    let left = this.left - this.padding
    let right = this.right + this.padding;

    // vertical rows
    for(let x = left; x < right; x++) {
      cursor.goto(x, top).write(boxHorizontal);
      cursor.goto(x, bottom).write(boxHorizontal);
    }

    // horizontal rows
    for(let y = top; y < bottom; y++) {
      cursor.goto(left, y).write(boxVertical);
      cursor.goto(right, y).write(boxVertical);
    }

    // top row
    cursor.goto(left, top).write(boxTopLeft);
    cursor.goto(right, top).write(boxTopRight);

    // bottom row
    cursor.goto(left, bottom).write(boxBottomLeft);
    cursor.goto(right, bottom).write(boxBottomRight);
  }
}

module.exports = Box;