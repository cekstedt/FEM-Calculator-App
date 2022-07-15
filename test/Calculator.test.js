import Calculator from "../src/Calculator";

describe("Numerical test", () => {
  let testCalc;

  it("displays only a zero on creation.", () => {
    testCalc = new Calculator();
    expect(testCalc.getDisplay()).toBe("0");
  });

  it("displays numbers when pressed.", () => {
    for (const key of "0123456789") {
      testCalc = new Calculator();
      testCalc.press(key);
      expect(testCalc.getDisplay()).toBe(key);
    }
  });

  it("displays multi-digit numbers correctly.", () => {
    testCalc = new Calculator();
    for (const key of "1234567890") {
      testCalc.press(key);
    }
    expect(testCalc.getDisplay()).toBe("1234567890");
  });
});
