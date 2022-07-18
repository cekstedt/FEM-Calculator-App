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
      // Remove commas.
      this.display = this.display.replaceAll(",", "");

      this.display += key;

      // Cleanup
      if (["", "-", "-0"].includes(this.display)) {
        this.display = "0";
      }
      if (this.display.length > 1 && this.display[0] === "0") {
        this.display = this.display.slice(1); // How does this handle "0."?
      }

      // Reformat with commas.
      this.display = parseFloat(this.display).toLocaleString("en-US");
    }
  }

  pressMany(keys) {
    for (const key in keys) {
      this.press(key);
    }
  }

  getDisplay() {
    return this.display;
  }

  // Add getActiveOperator()
  // What does it return when None?
}

export default Calculator;
