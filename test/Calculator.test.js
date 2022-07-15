import Calculator from "../src/Calculator";

describe("Test test", () => {
  let testCalc = new Calculator();

  it("is created empty.", () => {
    expect(testCalc.getDisplay()).toBe("0");
  });

  it("can press buttons.", () => {
    testCalc.press("1");
    expect(testCalc.getDisplay()).toBe("01");
  });
});
