import { updateScore } from "../score";

// Mock fetch globally
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ success: true }),
  }),
) as jest.Mock;

describe("updateScore", () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it("should call API with correct data", async () => {
    await updateScore("user1", 100, "msg1");

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/update-score",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          userId: "user1",
          score: 100,
          messageId: "msg1",
        }),
      }),
    );
  });

  it("should throw error on failure", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve({ success: false }),
    });

    await expect(updateScore("user1", 100, "msg1")).rejects.toThrow(
      "Failed to update score",
    );
  });
});
