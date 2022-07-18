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

  #hiddenOperand;
  #lastKeyOperatorFlag;

  constructor() {
    this.#reset();
  }

  press(key) {
    if (Calculator.#validKeys.includes(key)) {
      if ("0123456789".includes(key)) {
        this.display += key;
      } else if (key === "." && !this.display.includes(".")) {
        this.display += ".";
      } else if (key === "D") {
        this.display = this.display.slice(0, this.display.length - 1);
      } else if (key === "C") {
        this.#reset();
      } else if (Object.keys(Calculator.#operands).includes(key)) {
        this.activeOperator = key;
        this.#hiddenOperand = parseFloat(this.display);
        this.#lastKeyOperatorFlag = true;
      }

      // Cleanup
      if (["", "-", "-0"].includes(this.display)) {
        this.display = "0";
      }
      if (
        this.display.length > 1 &&
        this.display[0] === "0" &&
        this.display.slice(0, 2) != "0."
      ) {
        this.display = this.display.slice(1);
      }
    }
  }

  pressMany(keys) {
    for (const key of keys) {
      this.press(key);
    }
  }

  getDisplay() {
    return this.display;
  }

  getActiveOperator() {
    return this.activeOperator;
  }

  #reset() {
    this.display = "0";
    this.activeOperator = "";
    this.#hiddenOperand = 0;
    this.#lastKeyOperatorFlag = false;
  }
}

export default Calculator;
