import { useEffect, useState } from "react";

/**
 * Hook to get the telegram user ID and message ID from the hash params.
 * This hook is designed to run only on the client side.
 *
 * @returns An object containing the telegram user ID and message ID,
 *          both of which can be null.
 */
const useTelegramParams = (): {
  telegramUserId: string | null;
  telegramMessageId: string | null;
  isFromTelegram: boolean;
} => {
  const [telegramUserId, setTelegramUserId] = useState<string | null>(null);
  const [telegramMessageId, setTelegramMessageId] = useState<string | null>(
    null,
  );
  const parseHashParams = () => {
    const hash = window.location.hash.substring(1); // Remove the '#' character
    const params = new URLSearchParams(hash);

    const userId = params.get("userId");
    const messageId = params.get("messageId");

    if (userId) {
      setTelegramUserId(userId);
    }
    if (messageId) {
      setTelegramMessageId(messageId);
    }
  };
  useEffect(() => {
    parseHashParams();
  }, []);

  return {
    telegramUserId,
    telegramMessageId,
    isFromTelegram: !!telegramUserId,
  };
};

export default useTelegramParams;
