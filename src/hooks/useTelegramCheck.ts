import { useEffect, useState } from "react";

/**
 * Telegram message identification parameters.
 * Either inlineMessageId (inline mode) or chatId + messageId (direct mode).
 */
export interface TelegramMessageParams {
  inlineMessageId?: string;
  chatId?: string;
  messageId?: string;
}

/**
 * Hook to get the telegram user ID and message params from the hash params.
 * Supports both inline mode (inlineMessageId) and direct mode (chatId + messageId).
 */
const useTelegramParams = (): {
  telegramUserId: string | null;
  telegramMessageParams: TelegramMessageParams | null;
  isFromTelegram: boolean;
} => {
  const [telegramUserId, setTelegramUserId] = useState<string | null>(null);
  const [telegramMessageParams, setTelegramMessageParams] =
    useState<TelegramMessageParams | null>(null);

  const parseHashParams = () => {
    const hash = window.location.hash.substring(1); // Remove the '#' character
    const params = new URLSearchParams(hash);

    const userId = params.get("userId");
    const inlineMessageId = params.get("inlineMessageId");
    const chatId = params.get("chatId");
    const messageId = params.get("messageId");

    if (userId) {
      setTelegramUserId(userId);
    }

    if (inlineMessageId) {
      setTelegramMessageParams({ inlineMessageId });
    } else if (chatId && messageId) {
      setTelegramMessageParams({ chatId, messageId });
    }
  };

  useEffect(() => {
    parseHashParams();
  }, []);

  return {
    telegramUserId,
    telegramMessageParams,
    isFromTelegram: !!telegramUserId,
  };
};

export default useTelegramParams;
