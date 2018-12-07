const ansi = require('ansi');
const readline = require('readline');
const { stdout, stdin } = process;
const keys = require('./keys');

class Interface {
  constructor(output = stdout, input = stdin) {
    this.output = output;
    this.input = input;
    this.listeners = [];

    this.input.setRawMode(true);
    this.input.setEncoding('utf8');

    // hide cursor
    this.cursor = ansi(this.output).hide();

    // listen for keys
    this.input.addListener('data', data => {
      let key = Object.keys(keys).find(value => keys[value] === data);

      if(key === 'exit') this.exit();

      let match = this.listeners.filter(listener => {
        return listener.key === key || listener.key === data;
      });

      match.forEach(listener => listener.fn());
    });
  }

  get width() {
    return this.output.columns;
  }

  get height() {
    return this.output.rows;
  }

  get center() {
    return {
      x: Math.ceil(this.output.columns / 2),
      y: Math.ceil(this.output.rows / 2)
    }
  }

  onkey(key, fn) {
    this.listeners.push({ key, fn });
  }

  write(...args) {
    this.cursor.write(...args);
  }

  clear() {
    this.cursor.goto(0, 0);
    readline.clearScreenDown(this.output);
  }

  exit() {
    this.clear();
    process.exit();
  }
}

module.exports = Interface;