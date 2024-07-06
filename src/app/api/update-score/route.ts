/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable func-style */
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const RATE_LIMIT_MS = 60_000;
const RATE_LIMIT_ATTEMPTS = 10;

if (!TELEGRAM_BOT_TOKEN) {
  console.error("TELEGRAM_BOT_TOKEN is not set in environment variables");
}

// In-memory store for rate limiting (replace with Redis in production)
const userAttempts = new Map();

export async function POST(request: NextRequest) {
  if (!TELEGRAM_BOT_TOKEN) {
    return NextResponse.json(
      { success: false, error: "Server configuration error" },
      { status: 500 },
    );
  }

  const { userId, score, messageId } = await request.json();

  if (!userId || !score || !messageId) {
    return NextResponse.json(
      { success: false, error: "Missing required fields" },
      { status: 400 },
    );
  }

  // Rate limiting
  const now = Date.now();
  const userAttempt = userAttempts.get(userId) || { count: 0, timestamp: 0 };
  if (
    now - userAttempt.timestamp < RATE_LIMIT_MS &&
    userAttempt.count >= RATE_LIMIT_ATTEMPTS
  ) {
    return NextResponse.json(
      { success: false, error: "Rate limit exceeded" },
      { status: 429 },
    );
  }
  userAttempts.set(userId, { count: userAttempt.count + 1, timestamp: now });

  try {
    await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setGameScore`,
      {
        inline_message_id: messageId,
        user_id: userId,
        score: score,
      },
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating score:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update score" },
      { status: 500 },
    );
  }
}
