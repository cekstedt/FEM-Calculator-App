export default function formatNumber(display, numDigits) {
  // Turn empty inputs into zero.
  if (["", "-", "-0"].includes(display)) {
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
    parseFloat(display.replace("-", "")) >= 10 ** numDigits ||
    (parseFloat(display.replace("-", "")) < 0.1 ** numDigits &&
      parseFloat(display) !== 0)
  ) {
    if (digitLength(parseFloat(display).toExponential()) <= numDigits) {
      display = parseFloat(display).toExponential();
    } else {
      display = parseFloat(display).toExponential(numDigits - 1);
    }
  }

  // Trim trailing zeroes.
  // display = display.replace(/\.([0-9]*[1-9])?0*$/g, ".$1");

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
  return num.replace(".", "").length;
}
