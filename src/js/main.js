import Calculator from "./Calculator.js";
import themes from "./themes.js";

window.calc = new Calculator(12);
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
  ...makeSymmetricalObject([..."0123456789"])
};

const idMap = invertObject(keyMap);

// Hook up buttons and result field with Calculator object.
const keysContainer = document.querySelector(".calculator-keys-container");
const result = document.getElementById("result");
keysContainer.addEventListener("click", e => {
  if (e.target.matches("button")) {
    const key = e.target;
    const name = key.name;
    if (Object.keys(keyMap).includes(name)) {
      window.calc.press(keyMap[name]);
      result.textContent = window.calc.getDisplay();
    }
  }
});

// Hook up keyboard keys with Calculator object.
const keyboardKeys = new Set(
  [..."0123456789.+-/*=CcDdNn"].concat(["Backspace", "Enter"])
);

document.addEventListener("keydown", function(event) {
  if (keyboardKeys.has(event.key)) {
    if (event.key === "c") {
      window.calc.press("C");
      flicker(document.getElementById("RESET"));
    } else if (event.key === "Backspace") {
      window.calc.press("D");
      flicker(document.getElementById("DELETE"));
    } else if (event.key === "Enter") {
      window.calc.press("=");
      flicker(document.getElementById("EQUALS"));
    } else if (event.key === "n" || event.key === "N") {
      window.calc.press("±");
    } else {
      window.calc.press(event.key);
      flicker(document.getElementById(idMap[event.key]));
    }
    result.textContent = window.calc.getDisplay();
  }
});

// Hook up range input with theme switcher.
const range = document.getElementById("theme-selector");
range.addEventListener("input", e => {
  const root = document.documentElement;
  for (const [key, value] of Object.entries(themes[e.target.value])) {
    root.style.setProperty("--" + key, value);
  }
});

range.addEventListener("mouseover", e => {
  e.target.classList.toggle("active-button");
});

range.addEventListener("mouseout", e => {
  e.target.classList.toggle("active-button");
});

// Utility functions.

// Makes an object from an array where each key is also the value.
// ex: ["a", "b", "c"] => "{a: "a", b: "b", c: "c"}"
function makeSymmetricalObject(arr) {
  return arr.reduce((obj, x) => {
    obj[x] = x;
    return obj;
  }, {});
}

// Flips an object's keys and values.
// ex: {1: "a", 2: "b", 3: "c"} => {a: 1, b: 2, c: 3}
function invertObject(obj) {
  return Object.entries(obj).reduce((ret, entry) => {
    const [key, value] = entry;
    ret[value] = key;
    return ret;
  }, {});
}

// Visually flicker a button by toggling "active-button" css class.
function flicker(target) {
  target.classList.toggle("active-button");
  setTimeout(function() {
    target.classList.toggle("active-button");
  }, 100);
}
