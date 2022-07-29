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
  #chainValue;
  #lastOperator;
  #lastKeyOperatorFlag;
  #lastKeyEqualsFlag;
  MAX_DIGITS;

  // Constructor.

  constructor(max_digits = 16) {
    this.MAX_DIGITS = max_digits;
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
    this.display = this.display.replaceAll(",", "");
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
    this.#hiddenOperand = null;
    this.#lastKeyOperatorFlag = false;
    this.#lastKeyEqualsFlag = false;
    this.#lastOperator = "";
    this.#chainValue = null;
  }

  #numeralKey(key) {
    if (this.#lastKeyOperatorFlag || this.#lastKeyEqualsFlag) {
      this.display = key;
      this.#lastOperator = this.activeOperator;
    } else if (this.#digitSpace(this.MAX_DIGITS)) {
      this.display += key;
    }
    this.#lastKeyOperatorFlag = false;
    this.#lastKeyEqualsFlag = false;
    this.activeOperator = "";
  }

  #operatorKey(key) {
    if (!this.#lastKeyOperatorFlag) {
      this.#equalsKey();
    }
    this.activeOperator = key;
    this.#lastKeyOperatorFlag = true;
    this.#lastKeyEqualsFlag = false;
  }

  #equalsKey() {
    let operand1;
    let operand2;
    let operator;

    // If there is no #lastOperator, then the only options are
    // "number=" or "number{op}="
    if (!this.#lastOperator) {
      if (!this.#lastKeyOperatorFlag) {
        // If last key was a number, treat equals as solo equality operator.
        // Eg: "20=".
        // RETURNS IMMEDIATELY.
        this.#hiddenOperand = parseFloat(this.display);
        this.#lastKeyEqualsFlag = true;
        return;

        // If last key was an operator, repeat the previous numerical input.
        // ex: "3*=" becomes "3*3=".
      } else {
        this.#lastOperator = this.activeOperator;
        operator = this.#operators[this.#lastOperator];
        operand1 = this.#hiddenOperand;
        operand2 = this.#hiddenOperand;
        this.#hiddenOperand = parseFloat(this.display);
      }

      // Otherwise, proceed using existing #lastOperator.
    } else {
      operator = this.#operators[this.#lastOperator];

      // If last key was equals, repeat the previous calculation,
      // but switch the operands (since we display the result,
      // which should be operand1). Also, use #chainValue
      // as operand2, for operator chaining. eg: "3*2===="
      if (this.#lastKeyEqualsFlag) {
        operand1 = parseFloat(this.display);
        operand2 = this.#chainValue;

        // Otherwise, last key was numerical (or editing). Calculate as normal.
      } else {
        operand1 = this.#hiddenOperand;
        operand2 = parseFloat(this.display);
        this.#hiddenOperand = operator(operand1, operand2);
      }
    }

    // Main exit point.
    this.display = "" + operator(operand1, operand2);
    this.#chainValue = operand2;
    this.#lastKeyEqualsFlag = true;
  }

  #negateKey() {
    if (this.#lastKeyOperatorFlag || this.#lastKeyEqualsFlag) {
      this.#hiddenOperand = parseFloat(this.display);
      this.#lastOperator = this.activeOperator;
      this.activeOperator = "";
    }
    this.display = "" + parseFloat(this.display) * -1;
    this.#lastKeyOperatorFlag = false;
    this.#lastKeyEqualsFlag = false;
  }

  #decimalKey() {
    if (!this.display.includes(".")) {
      if (this.#lastKeyOperatorFlag) {
        this.display = "0.";
        this.#lastOperator = this.activeOperator;
        this.activeOperator = "";
      } else {
        this.display += ".";
      }
    }
    this.#lastKeyOperatorFlag = false;
    this.#lastKeyEqualsFlag = false;
  }

  #deleteKey() {
    if (!this.#lastKeyEqualsFlag) {
      this.display = this.display.slice(0, this.display.length - 1);
    }
    if (this.#lastKeyOperatorFlag) {
      this.display = "0";
    }
  }

  // Utility Functions.

  #cleanupDisplay() {
    // Turn empty inputs into zero.
    if (["", "-", "-0"].includes(this.display)) {
      this.display = "0";
    }

    // Trim leading zeroes when not necessary.
    if (
      this.display.length > 1 &&
      this.display[0] === "0" &&
      this.display.slice(0, 2) !== "0."
    ) {
      this.display = this.display.slice(1);
    }

    // // Truncate decimals when too long.
    // if (
    //   this.display.includes(".") &&
    //   parseFloat(this.display) < 10 ** this.MAX_DIGITS &&
    //   parseFloat(this.display) >= 0.1 ** this.MAX_DIGITS
    // ) {
    //   let [whole, fractional] = this.display.split(".");
    //   console.log(`"${whole}" "${fractional}"`);
    //   if (fractional) {
    //     fractional = parseFloat("." + fractional).toFixed(
    //       this.MAX_DIGITS - whole.length
    //     );
    //     this.display = whole + fractional;
    //   }
    // }
    //

    // Turn to scientific notation when necessary.
    if (
      parseFloat(this.display.replace("-", "")) >= 10 ** this.MAX_DIGITS ||
      (parseFloat(this.display.replace("-", "")) < 0.1 ** this.MAX_DIGITS &&
        parseFloat(this.display) !== 0)
    ) {
      this.display = parseFloat(this.display).toExponential(
        this.MAX_DIGITS - 1
      );
    }

    // Trim trailing zeroes.
    // this.display = this.display.replace(/\.([0-9]*[1-9])?0*$/g, ".$1");

    // Add commas where necessary
    if (this.display.includes(".")) {
      let [whole, fractional] = this.display.split(".");
      this.display = this.#addCommas(whole) + "." + fractional;
    } else {
      this.display = this.#addCommas(this.display);
    }
  }

  #digitSpace(max) {
    return this.display.replaceAll(/[^0-9]/g, "").length < max;
  }

  #addCommas(str) {
    return str.replaceAll(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}

export default Calculator;
