import { updateScore } from "../score";

// Set env var before tests
process.env.NEXT_PUBLIC_SCORE_API_URL = "/api/update-score";

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

  it("should call API with inline message params", async () => {
    await updateScore("user1", 100, { inlineMessageId: "inline123" });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/update-score",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          userId: "user1",
          score: 100,
          inlineMessageId: "inline123",
        }),
      }),
    );
  });

  it("should call API with direct message params", async () => {
    await updateScore("user1", 100, { chatId: "12345", messageId: "67" });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/update-score",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          userId: "user1",
          score: 100,
          chatId: "12345",
          messageId: "67",
        }),
      }),
    );
  });

  it("should throw error on failure", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve({ success: false }),
    });

    await expect(
      updateScore("user1", 100, { inlineMessageId: "msg1" }),
    ).rejects.toThrow("Failed to update score");
  });
});
