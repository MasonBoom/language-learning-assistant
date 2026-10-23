import { NextRequest, NextResponse } from "next/server";
import { conversationPrompt, isDifficulty, isLearningLanguage } from "@/helpers/languageConversation";
import {
  apiError,
  AudioApiError,
  handleApiError,
  NO_STORE_HEADERS,
  requestOpenAI,
  requireUser,
} from "@/helpers/openai";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const authError = requireUser(request);
  if (authError) return authError;

  let body;
  try {
    body = await request.json();
  } catch {
    return apiError("Send the conversation as valid JSON.", 400);
  }
  if (!body || typeof body.text !== "string" || !body.text.trim() || body.text.length > 10_000) {
    return apiError("Conversation text must contain between 1 and 10,000 characters.", 400);
  }
  if (!isLearningLanguage(body.language) || !isDifficulty(body.difficulty)) {
    return apiError("Select a supported learning language and difficulty level.", 400);
  }

  try {
    const response = await requestOpenAI("chat/completions", "AI reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-5.4-mini",
        messages: [
          { role: "system", content: conversationPrompt(body.language.trim(), body.difficulty) },
          { role: "user", content: body.text.trim() },
        ],
        reasoning_effort: "none",
        max_completion_tokens: 1024,
      }),
    });
    const result = await response.json();
    const text = result?.choices?.[0]?.message?.content;
    if (typeof text !== "string" || !text.trim()) {
      throw new AudioApiError("The AI reply was empty. Please try again.");
    }
    return NextResponse.json({ text: text.trim() }, { headers: NO_STORE_HEADERS });
  } catch (error) {
    return handleApiError(error, "AI reply");
  }
}
