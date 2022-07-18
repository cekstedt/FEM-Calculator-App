import Calculator from "../src/Calculator";

describe("Numerical input", () => {
  let testCalc;

  it("displays only a zero on creation.", () => {
    testCalc = new Calculator();
    expect(testCalc.getDisplay()).toBe("0");
  });

  it("displays single numbers when pressed.", () => {
    for (const key of "0123456789") {
      testCalc = new Calculator();
      testCalc.press(key);
      expect(testCalc.getDisplay()).toBe(key);
    }
  });

  it("displays multi-digit numbers correctly.", () => {
    testCalc = new Calculator();
    testCalc.pressMany("1234567890");
    expect(testCalc.getDisplay()).toBe("1,234,567,890");
  });
});

describe("Happy path", () => {
  it("displays decimal points correctly.", () => {
    testCalc = new Calculator();
    testCalc.press("1");
    expect(testCalc.getDisplay()).toBe("1");
    testCalc.press(".");
    expect(testCalc.getDisplay()).toBe("1.");
    testCalc.press("2");
    expect(testCalc.getDisplay()).toBe("1.2");
  });

  it("registers operators correctly.", () => {
    testCalc = new Calculator();
    testCalc.press("6");
    expect(testCalc.getDisplay()).toBe("1");
    testCalc.press("*");
    expect(testCalc.getActiveOperator()).toBe("*");
    testCalc.press("8");
    expect(testCalc.getDisplay()).toBe("8");
    expect(testCalc.getActiveOperator()).toBe("");
  });

  it("executes the equals key correctly.", () => {
    testCalc = new Calculator();
    testCalc.pressMany("6*8=");
    expect(testCalc.getDisplay()).toBe("48");
  });
});

describe("Edge cases: Decimal points", () => {
  it("displays repeated decimal points correctly.", () => {
    testCalc = new Calculator();
    testCalc.press("1");
    expect(testCalc.getDisplay()).toBe("1");
    testCalc.press(".");
    expect(testCalc.getDisplay()).toBe("1.");
    testCalc.press(".");
    expect(testCalc.getDisplay()).toBe("1.");
    testCalc.press("2");
    expect(testCalc.getDisplay()).toBe("1.2");
    testCalc.press(".");
    expect(testCalc.getDisplay()).toBe("1.2");
  });

  it("interprets solo decimal point clicks as 0.", () => {
    testCalc = new Calculator();
    testCalc.press(".");
    expect(testCalc.getDisplay()).toBe("0.");

    testCalc = new Calculator();
    testCalc.pressMany("4*.");
    expect(testCalc.getDisplay()).toBe("0.");
    expect(testCalc.getActiveOperator()).toBe("");
  });
});

describe("Edge cases: Operators", () => {
  it("logs operator clicks even when first.", () => {
    for (const op of "+-*/") {
      testCalc = new Calculator();
      testCalc.press(op);
      expect(testCalc.getActiveOperator()).toBe(op);
    }
  });

  it("does nothing if operator is pressed multiple times.", () => {
    for (const op of "+-*/") {
      testCalc = new Calculator();
      testCalc.press(op);
      expect(testCalc.getActiveOperator()).toBe(op);
      testCalc.press(op);
      expect(testCalc.getActiveOperator()).toBe(op);
    }
  });

  it("treats a new operator press as a correction.", () => {
    for (const op1 of "+-*/") {
      for (const op2 of "+-*/") {
        testCalc = new Calculator();
        testCalc.press(op1);
        expect(testCalc.getActiveOperator()).toBe(op1);
        testCalc.press(op2);
        expect(testCalc.getActiveOperator()).toBe(op2);
      }
    }
  });

  it("calculates (equals) on second operator press.", () => {
    testCalc = new Calculator();
    testCalc.pressMany("4*8+");
    expect(testCalc.getDisplay()).toBe("32");
    expect(testCalc.getActiveOperator()).toBe("+");
  });

  it("...but only once.", () => {
    testCalc = new Calculator();
    testCalc.pressMany("4*8+");
    expect(testCalc.getDisplay()).toBe("32");
    expect(testCalc.getActiveOperator()).toBe("+");
    testCalc.press("+");
    expect(testCalc.getDisplay()).toBe("32");
    expect(testCalc.getActiveOperator()).toBe("+");
    testCalc.press("-");
    expect(testCalc.getDisplay()).toBe("32");
    expect(testCalc.getActiveOperator()).toBe("-");
  });

  it("can chain operations.", () => {
    testCalc = new Calculator();
    testCalc.pressMany("4*8+");
    expect(testCalc.getDisplay()).toBe("32");
    expect(testCalc.getActiveOperator()).toBe("+");
    testCalc.pressMany("2-");
    expect(testCalc.getDisplay()).toBe("34");
    expect(testCalc.getActiveOperator()).toBe("-");
    testCalc.pressMany("14/");
    expect(testCalc.getDisplay()).toBe("20");
    expect(testCalc.getActiveOperator()).toBe("/");
  });
});

describe("Edge cases: Equals button.", () => {
  it("does nothing if equals key pressed first.", () => {
    testCalc = new Calculator();
    testCalc.press("=");
    expect(testCalc.getDisplay()).toBe("0");
    expect(testCalc.getActiveOperator()).toBe("");
  });

  it("treats equals like a standalone calculation.", () => {
    testCalc = new Calculator();
    testCalc.pressMany("10=");
    expect(testCalc.getDisplay()).toBe("10");
    testCalc.pressMany("23=");
    expect(testCalc.getDisplay()).toBe("23");
    testCalc.pressMany("4.9=");
    expect(testCalc.getDisplay()).toBe("4.9");
  });

  it("treats op-equals like a repeated operand.", () => {
    testCalc = new Calculator();
    testCalc.pressMany("3*=");
    expect(testCalc.getDisplay()).toBe("9");
  });

  it("repeats calculations on equals presses.", () => {
    testCalc = new Calculator();
    testCalc.pressMany("5-1=");
    expect(testCalc.getDisplay()).toBe("4");
    testCalc.press("=");
    expect(testCalc.getDisplay()).toBe("3");
    testCalc.press("=");
    expect(testCalc.getDisplay()).toBe("2");
    testCalc.press("=");
    expect(testCalc.getDisplay()).toBe("1");
  });

  it("replaces the display number with pressed number after equals.", () => {
    testCalc = new Calculator();
    testCalc.pressMany("5-1=");
    expect(testCalc.getDisplay()).toBe("4");
    testCalc.press("2");
    expect(testCalc.getDisplay()).toBe("2");
  });

  it("can chain operations.", () => {
    testCalc = new Calculator();
    testCalc.pressMany("4*8=");
    expect(testCalc.getDisplay()).toBe("32");
    expect(testCalc.getActiveOperator()).toBe("");
    testCalc.pressMany("+2=");
    expect(testCalc.getDisplay()).toBe("34");
    expect(testCalc.getActiveOperator()).toBe("");
    testCalc.pressMany("-14=");
    expect(testCalc.getDisplay()).toBe("20");
    expect(testCalc.getActiveOperator()).toBe("");
  });
});

// Reset key functions

// Delete key functions
