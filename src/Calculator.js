class Calculator {
  static #operands = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "/": (a, b) => a / b,
    "*": (a, b) => a * b
  };

  constructor() {
    this.display = "0";
  }

  press(key) {
    this.display += key;
  }

  getDisplay() {
    return this.display;
  }
}

export default Calculator;
