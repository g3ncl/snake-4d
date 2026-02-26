import { TelegramMessageParams } from "@/hooks/useTelegramCheck";

/**
 * Sends the user score to the server for updating.
 *
 * @param {string} userId - The unique identifier of the user.
 * @param {number} score - The score to be sent to the server.
 * @param {TelegramMessageParams} messageParams - The message identification params.
 * @return {Promise<any>} A Promise that resolves to the JSON response from the server.
 */
const sendScore = async (
  userId: string,
  score: number,
  messageParams: TelegramMessageParams,
) => {
  const apiUrl = process.env.NEXT_PUBLIC_SCORE_API_URL;
  if (!apiUrl) {
    throw new Error("Score API URL not configured");
  }
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, score, ...messageParams }),
  });
  return response.json();
};

export const updateScore = async (
  userId: string,
  score: number,
  messageParams: TelegramMessageParams,
) => {
  const response = await sendScore(userId, score, messageParams);
  if (!response.success) {
    throw new Error("Failed to update score");
  }
};
