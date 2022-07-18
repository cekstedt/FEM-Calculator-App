class Calculator {
  static #operands = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "/": (a, b) => a / b,
    "*": (a, b) => a * b
  };

  static #validKeys = [..."0123456789CD.±="].concat(
    Object.keys(Calculator.#operands)
  );

  #hiddenOperand;
  #lastOperator;
  #lastKeyOperatorFlag;

  constructor() {
    this.#reset();
  }

  press(key) {
    if (Calculator.#validKeys.includes(key)) {
      if ("0123456789".includes(key)) {
        if (this.#lastKeyOperatorFlag) {
          this.display = key;
          this.#lastKeyOperatorFlag = false;
          this.#lastOperator = this.activeOperator;
          this.activeOperator = "";
        } else {
          this.display += key;
        }
        this.activeOperator = "";
      } else if (key === "." && !this.display.includes(".")) {
        if (this.#lastKeyOperatorFlag) {
          this.display = "0.";
          this.#lastOperator = this.activeOperator;
          this.activeOperator = "";
          this.#lastKeyOperatorFlag = false;
        } else {
          this.display += ".";
        }
      } else if (key === "D") {
        this.display = this.display.slice(0, this.display.length - 1);
      } else if (key === "C") {
        this.#reset();
      } else if (Object.keys(Calculator.#operands).includes(key)) {
        this.activeOperator = key;
        this.#hiddenOperand = parseFloat(this.display);
        this.#lastKeyOperatorFlag = true;
      } else if (key === "=") {
        let temp = parseFloat(this.display);
        this.display =
          "" +
          Calculator.#operands[this.#lastOperator](this.#hiddenOperand, temp);
        this.#hiddenOperand = temp;
      } else {
        console.log(key + ": not found?");
      }

      this.#cleanupDisplay();
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
    this.#lastOperator = "";
  }

  #cleanupDisplay() {
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

export default Calculator;
