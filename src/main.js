import Calculator from "./calculator.js";
import themes from "./themes.js";

const calc = new Calculator();
const keyMap = {
  ADD: "+",
  SUBTRACT: "-",
  MULTIPLY: "*",
  DIVIDE: "/",
  DECIMAL: ".",
  RESET: "C",
  DELETE: "D",
  EQUALS: "=",
  //The rest of the key/value pairs are symmetrical.
  ...[..."0123456789"].reduce((obj, x) => {
    obj[x] = x;
    return obj;
  }, {})
};

// Hook up buttons and result field with Calculator object.
const keys = document.querySelector(".calculator-keys-container");
const result = document.getElementById("result");
keys.addEventListener("click", e => {
  if (e.target.matches("button")) {
    const key = e.target;
    const name = key.name;
    if (Object.keys(keyMap).includes(name)) {
      calc.press(keyMap[name]);
      result.textContent = calc.getDisplay();
    }
  }
});

// Hook up range input with theme switcher.
const range = document.getElementById("theme-selector");
range.addEventListener("input", e => {
  const root = document.documentElement;
  for (const [key, value] of Object.entries(themes[e.target.value])) {
    console.log(`${key}: ${value};`);
    root.style.setProperty("--" + key, value);
  }
});
