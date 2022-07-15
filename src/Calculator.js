class Calculator {
  static #operands = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "/": (a, b) => a / b,
    "*": (a, b) => a * b
  };

  static #validKeys = [..."0123456789CD.±"].concat(
    Object.keys(Calculator.#operands)
  );

  constructor() {
    this.display = "0";
  }

  press(key) {
    if (Calculator.#validKeys.includes(key)) {
      this.display += key;

      // Cleanup
      if (["", "-", "-0"].includes(this.display)) {
        this.display = "0";
      }
      if (this.display.length > 1 && this.display[0] === "0") {
        this.display = this.display.slice(1);
      }
    }
  }

  getDisplay() {
    return this.display;
  }
}

export default Calculator;
