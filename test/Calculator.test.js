import Calculator from "../src/Calculator";

let testCalc;

beforeEach(() => {
  testCalc = new Calculator();
});

describe("Numerical input", () => {
  it("displays only a zero on creation.", () => {
    expect(testCalc.getDisplay()).toBe("0");
  });

  it.each([..."0123456789"])("displays single numbers when pressed.", key => {
    testCalc.press(key);
    expect(testCalc.getDisplay()).toBe(key);
  });

  it("displays multi-digit numbers correctly.", () => {
    testCalc.pressMany("1234567890");
    expect(testCalc.getDisplay()).toBe("1234567890");
  });
});

describe("Happy path", () => {
  it("displays decimal points correctly.", () => {
    testCalc.press("1");
    expect(testCalc.getDisplay()).toBe("1");
    testCalc.press(".");
    expect(testCalc.getDisplay()).toBe("1.");
    testCalc.press("2");
    expect(testCalc.getDisplay()).toBe("1.2");
  });

  it("registers operators correctly.", () => {
    testCalc.press("6");
    expect(testCalc.getDisplay()).toBe("6");
    testCalc.press("*");
    expect(testCalc.getActiveOperator()).toBe("*");
    testCalc.press("8");
    expect(testCalc.getDisplay()).toBe("8");
    expect(testCalc.getActiveOperator()).toBe("");
  });

  it("executes the equals key correctly.", () => {
    testCalc.pressMany("6*8=");
    expect(testCalc.getDisplay()).toBe("48");
  });
});

describe("Edge cases: Decimal points", () => {
  it("displays repeated decimal points correctly.", () => {
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
    testCalc.press(".");
    expect(testCalc.getDisplay()).toBe("0.");
  });

  it("...even after a operator.", () => {
    testCalc.pressMany("4*.");
    expect(testCalc.getDisplay()).toBe("0.");
    expect(testCalc.getActiveOperator()).toBe("");
  });
});

describe("Edge cases: Operators", () => {
  it.each([..."+-*/"])("logs operator clicks even when first.", op => {
    testCalc.press(op);
    expect(testCalc.getActiveOperator()).toBe(op);
  });

  it.each([..."+-*/"])(
    "does nothing if operator is pressed multiple times.",
    op => {
      testCalc.press(op);
      expect(testCalc.getActiveOperator()).toBe(op);
      testCalc.press(op);
      expect(testCalc.getActiveOperator()).toBe(op);
    }
  );

  it("treats a new operator press as a correction.", () => {
    testCalc.press("+");
    expect(testCalc.getActiveOperator()).toBe("+");
    testCalc.press("-");
    expect(testCalc.getActiveOperator()).toBe("-");
  });

  it("calculates (equals) on second operator press.", () => {
    testCalc.pressMany("4*8+");
    expect(testCalc.getDisplay()).toBe("32");
    expect(testCalc.getActiveOperator()).toBe("+");
  });

  it("...but only once.", () => {
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
    testCalc.press("=");
    expect(testCalc.getDisplay()).toBe("0");
    expect(testCalc.getActiveOperator()).toBe("");
  });

  it("treats equals like a standalone calculation.", () => {
    testCalc.pressMany("10=");
    expect(testCalc.getDisplay()).toBe("10");
    testCalc.pressMany("23=");
    expect(testCalc.getDisplay()).toBe("23");
    testCalc.pressMany("4.9=");
    expect(testCalc.getDisplay()).toBe("4.9");
  });

  it("treats op-equals like a repeated operand.", () => {
    testCalc.pressMany("3*=");
    expect(testCalc.getDisplay()).toBe("9");
  });

  it("repeats calculations on equals presses.", () => {
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
    testCalc.pressMany("5-1=");
    expect(testCalc.getDisplay()).toBe("4");
    testCalc.press("2");
    expect(testCalc.getDisplay()).toBe("2");
  });

  it("can chain operations.", () => {
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

describe("Delete key function", () => {
  it("removes entered numbers and decimals.", () => {
    testCalc.pressMany("123.456D");
    expect(testCalc.getDisplay()).toBe("123.45");
    testCalc.press("D");
    expect(testCalc.getDisplay()).toBe("123.4");
    testCalc.press("D");
    expect(testCalc.getDisplay()).toBe("123.");
    testCalc.press("D");
    expect(testCalc.getDisplay()).toBe("123");
    testCalc.press("D");
    expect(testCalc.getDisplay()).toBe("12");
    testCalc.press("D");
    expect(testCalc.getDisplay()).toBe("1");
    testCalc.press("D");
    expect(testCalc.getDisplay()).toBe("0");
    testCalc.press("D");
    expect(testCalc.getDisplay()).toBe("0");
    testCalc.press("D");
    expect(testCalc.getDisplay()).toBe("0");
  });

  it("has no effect after operators.", () => {
    testCalc.pressMany("1+D");
    expect(testCalc.getDisplay()).toBe("1");
    expect(testCalc.getActiveOperator()).toBe("+");
  });

  it("has no effect after equals.", () => {
    testCalc.pressMany("1+2=D");
    expect(testCalc.getDisplay()).toBe("3");
    expect(testCalc.getActiveOperator()).toBe("");
  });
});

describe("Reset key function", () => {
  it("clears display and active operator.", () => {
    testCalc.pressMany("1+2*3=C");
    expect(testCalc.getDisplay()).toBe("0");
    expect(testCalc.getActiveOperator()).toBe("");
  });

  it("does not leave behind any artifacts.", () => {
    testCalc.pressMany("1+2=C6====");
    expect(testCalc.getDisplay()).toBe("6");
  });
});
