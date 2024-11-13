export default function formatNumber(display, numDigits) {
  // Turn empty inputs into zero.
  if ([""].includes(display)) {
    display = "0";
  }

  // Trim leading zero when not necessary.
  if (
    display.length > 1 &&
    display[0] === "0" &&
    display.slice(0, 2) !== "0."
  ) {
    display = display.slice(1);
  }

  // Add commas where necessary
  if (display.includes(".")) {
    let [whole, fractional] = display.split(".");
    display = addCommas(whole) + "." + fractional;
  } else {
    display = addCommas(display);
  }

  return display;
}

// Utility functions.

function addCommas(str) {
  return str.replaceAll(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function digitLength(num) {
  return num.replace(/[\.\-]/g, "").length;
}
