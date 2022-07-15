import Calculator from "./calculator.js";

const calc = new Calculator();

const keys = document.querySelector(".calculator-keys");
const result = document.querySelector("#result");

const keyMap = {
  ADD: "+",
  SUBTRACT: "-",
  MULTIPLY: "*",
  DIVIDE: "/",
  DECIMAL: ".",
  RESET: "C",
  DELETE: "D",
  EQUALS: "=",
  ...[..."0123456789"].reduce((obj, x) => {
    obj[x] = x;
    return obj;
  }, {})
};

keys.addEventListener("click", e => {
  if (e.target.matches("button")) {
    const key = e.target;
    const name = key.name;
    if (Object.keys(keyMap).includes(name)) {
      calc.press(name);
      result.textContent = calc.getDisplay();
    }
  }
});
