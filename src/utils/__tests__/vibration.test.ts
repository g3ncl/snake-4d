import { triggerVibration } from "../vibration";

describe("triggerVibration", () => {
  it("should call navigator.vibrate if available", () => {
    const mockVibrate = jest.fn();
    Object.defineProperty(global, "navigator", {
      value: { vibrate: mockVibrate },
      writable: true,
    });

    triggerVibration(100);
    expect(mockVibrate).toHaveBeenCalledWith(100);
  });

  it("should not throw if navigator is undefined", () => {
    Object.defineProperty(global, "navigator", {
      value: undefined,
      writable: true,
    });
    expect(() => triggerVibration(100)).not.toThrow();
  });
});
