import { NextRequest, NextResponse } from "next/server";
import { apiError, handleApiError, NO_STORE_HEADERS, requestOpenAI, requireUser } from "@/helpers/openai";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const authError = requireUser(request);
  if (authError) return authError;

  let body;
  try {
    body = await request.json();
  } catch {
    return apiError("Send the speech request as valid JSON.", 400);
  }
  if (!body || typeof body.text !== "string" || !body.text.trim() || body.text.length > 4096) {
    return apiError("Speech text must contain between 1 and 4,096 characters.", 400);
  }

  try {
    const response = await requestOpenAI("audio/speech", "Speech generation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "tts-1-hd",
        voice: "alloy",
        input: body.text.trim(),
        response_format: "mp3",
      }),
    });
    return new NextResponse(response.body, {
      headers: { ...NO_STORE_HEADERS, "Content-Type": "audio/mpeg" },
    });
  } catch (error) {
    return handleApiError(error, "Speech generation");
  }
}
