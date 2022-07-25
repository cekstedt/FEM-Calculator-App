class Calculator {
  // Variable initialization.

  #operators = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "/": (a, b) => a / b,
    "*": (a, b) => a * b
  };

  #numerals = [..."0123456789"];

  #validKeys = [..."CD.±="]
    .concat(Object.keys(this.#operators))
    .concat(this.#numerals);

  #pressMap = new Map();

  #hiddenOperand;
  #lastOperator;
  #lastKeyOperatorFlag;

  // Constructor.

  constructor() {
    for (const num of this.#numerals) {
      this.#pressMap.set(num, this.#numeralKey.bind(this));
    }
    for (const op in this.#operators) {
      this.#pressMap.set(op, this.#operatorKey.bind(this));
    }
    this.#pressMap.set("C", this.#reset.bind(this));
    this.#pressMap.set("D", this.#deleteKey.bind(this));
    this.#pressMap.set(".", this.#decimalKey.bind(this));
    this.#pressMap.set("±", this.#negateKey.bind(this));
    this.#pressMap.set("=", this.#equalsKey.bind(this));

    this.#reset();
  }

  // Main entry point. Delegates keypress data to computing functions.

  press(key) {
    this.#pressMap.get(key)(key);

    this.#cleanupDisplay();
  }

  // Convenience method, to send a string of 1 char keypresses.

  pressMany(keys) {
    for (const key of keys) {
      this.press(key);
    }
  }

  // Getters for outfacing data.

  getDisplay() {
    return this.display;
  }

  getActiveOperator() {
    return this.activeOperator;
  }

  // Operational functions.

  #reset() {
    this.display = "0";
    this.activeOperator = "";
    this.#hiddenOperand = 0;
    this.#lastKeyOperatorFlag = false;
    this.#lastOperator = "";
  }

  #numeralKey(key) {
    if (this.#lastKeyOperatorFlag) {
      this.display = key;
      this.#lastKeyOperatorFlag = false;
      this.#lastOperator = this.activeOperator;
      this.activeOperator = "";
    } else {
      this.display += key;
    }
    this.activeOperator = "";
  }

  #operatorKey(key) {
    this.activeOperator = key;
    this.#hiddenOperand = parseFloat(this.display);
    this.#lastKeyOperatorFlag = true;
  }

  #equalsKey() {
    let temp = parseFloat(this.display);
    this.display =
      "" + this.#operators[this.#lastOperator](this.#hiddenOperand, temp);
    this.#hiddenOperand = temp;
  }

  #negateKey() {}

  #decimalKey() {
    if (!this.display.includes(".")) {
      if (this.#lastKeyOperatorFlag) {
        this.display = "0.";
        this.#lastOperator = this.activeOperator;
        this.activeOperator = "";
        this.#lastKeyOperatorFlag = false;
      } else {
        this.display += ".";
      }
    }
  }

  #deleteKey() {
    this.display = this.display.slice(0, this.display.length - 1);
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
