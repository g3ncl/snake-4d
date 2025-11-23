import {
  getAudioContext,
  getBufferFromCache,
  addBufferToCache,
} from "../audio";

describe("audio utils", () => {
  beforeEach(() => {
    // Mock AudioContext which is missing in JSDOM
    (window as any).AudioContext = jest.fn().mockImplementation(() => ({
      state: "running",
    }));
    (window as any).webkitAudioContext = (window as any).AudioContext;
  });

  it("should cache buffers", () => {
    const mockBuffer = {} as AudioBuffer;
    addBufferToCache("test-url", mockBuffer);
    expect(getBufferFromCache("test-url")).toBe(mockBuffer);
  });

  it("should return undefined for missing buffer", () => {
    expect(getBufferFromCache("missing-url")).toBeUndefined();
  });

  it("should create AudioContext singleton", () => {
    const mockContext = { state: "running" };
    const mockConstructor = jest.fn(() => mockContext);
    (global as any).AudioContext = mockConstructor;

    // Note: Since module scope variable `audioContext` might be already set if tests run in parallel or same process,
    // this test is flaky if not isolated. But Jest isolates modules by default.
    const ctx1 = getAudioContext();
    const ctx2 = getAudioContext();

    expect(ctx1).toBe(ctx2);
    expect(mockConstructor).toHaveBeenCalledTimes(1);
  });
});
