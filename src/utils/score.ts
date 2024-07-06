/**
 * Sends the user score to the server for updating.
 *
 * @param {string} userId - The unique identifier of the user.
 * @param {number} score - The score to be sent to the server.
 * @return {Promise<any>} A Promise that resolves to the JSON response from the server.
 */
const sendScore = async (userId: string, score: number, messageId: string) => {
  const response = await fetch("/api/update-score", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, score, messageId }),
  });
  return response.json();
};

export const updateScore = async (
  userId: string,
  score: number,
  messageId: string,
) => {
  const response = await sendScore(userId, score, messageId);
  if (!response.success) {
    throw new Error("Failed to update score");
  }
};
