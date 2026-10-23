import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export const NO_STORE_HEADERS = { "Cache-Control": "no-store" };

export class AudioApiError extends Error {
  constructor(message: string, public status = 502) {
    super(message);
    this.name = "AudioApiError";
  }
}

export function apiError(message: string, status: number) {
  return NextResponse.json(
    { error: message },
    { status, headers: NO_STORE_HEADERS }
  );
}

export function requireUser(request: NextRequest) {
  try {
    if (!getDataFromToken(request)) {
      return apiError("Please log in before practicing a conversation.", 401);
    }
    return null;
  } catch {
    return apiError("Your session has expired. Please log in again.", 401);
  }
}

export function handleApiError(error: unknown, stage: string) {
  if (error instanceof AudioApiError) {
    return apiError(error.message, error.status);
  }
  return apiError(`${stage} failed. Please try again.`, 502);
}

// Keep the app's existing environment variable name. This helper is imported
// only by server routes; provider requests and error details stay on the server.
export async function requestOpenAI(
  path: string,
  stage: string,
  options: RequestInit
) {
  const key = process.env.NEXT_PUBLIC_OPENAI_KEY?.trim();
  if (!key) {
    throw new AudioApiError(
      `${stage} is unavailable: set NEXT_PUBLIC_OPENAI_KEY in the app environment.`,
      503
    );
  }

  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${key}`);

  let response: Response;
  try {
    response = await fetch(`https://api.openai.com/v1/${path}`, {
      ...options,
      headers,
      cache: "no-store",
      signal: AbortSignal.timeout(60_000),
    });
  } catch {
    throw new AudioApiError(
      `${stage} could not reach OpenAI or timed out. Please try again.`
    );
  }

  if (response.ok) return response;

  // Inspect only the error code needed to distinguish quota from rate limits.
  // Provider messages can include request details and are deliberately omitted.
  const providerError = await response.json().catch(() => null);
  const code = providerError?.error?.code;

  if (response.status === 401 || response.status === 403) {
    throw new AudioApiError(
      `${stage} failed: OpenAI rejected the server credentials or model permissions. Check NEXT_PUBLIC_OPENAI_KEY.`
    );
  }
  if (response.status === 429) {
    throw new AudioApiError(
      code === "insufficient_quota"
        ? `${stage} failed: the OpenAI account has no available API quota. Check billing and usage limits.`
        : `${stage} is temporarily rate limited. Wait a moment and try again.`,
      429
    );
  }
  if (response.status === 404) {
    throw new AudioApiError(
      `${stage} failed: the configured OpenAI model is unavailable to this account.`
    );
  }
  if (response.status === 400 || response.status === 422) {
    throw new AudioApiError(
      path === "audio/transcriptions"
        ? `${stage} failed: OpenAI could not read this audio. Record another clip and try again.`
        : `${stage} failed: OpenAI rejected the request. Check the server model configuration.`
    );
  }
  throw new AudioApiError(
    `${stage} failed: OpenAI returned status ${response.status}. Please try again.`
  );
}
