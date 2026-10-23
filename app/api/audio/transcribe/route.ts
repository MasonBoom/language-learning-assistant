import { NextRequest, NextResponse } from "next/server";
import { isTranscriptionLanguage } from "@/helpers/languageConversation";
import {
  apiError,
  AudioApiError,
  handleApiError,
  NO_STORE_HEADERS,
  requestOpenAI,
  requireUser,
} from "@/helpers/openai";

export const runtime = "nodejs";

const MAX_AUDIO_BYTES = 25 * 1024 * 1024;
const SUPPORTED_EXTENSIONS = /\.(webm|mp4|m4a|mp3|mpeg|mpga|wav|ogg|flac)$/i;
const SUPPORTED_TYPES = new Set([
  "audio/webm", "video/webm", "audio/mp4", "video/mp4", "audio/x-m4a",
  "audio/mpeg", "audio/mp3", "audio/mpga", "audio/wav", "audio/x-wav",
  "audio/wave", "audio/ogg", "application/ogg", "audio/flac", "audio/x-flac",
]);

export async function POST(request: NextRequest) {
  const authError = requireUser(request);
  if (authError) return authError;

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return apiError("Send the recording as multipart form data.", 400);
  }

  const file = form.get("file");
  if (!file || typeof file === "string" || file.size === 0) {
    return apiError("The recording is empty. Record another clip and try again.", 400);
  }
  if (file.size > MAX_AUDIO_BYTES) {
    return apiError("The recording exceeds 25 MB. Record a shorter clip.", 413);
  }
  const mime = file.type.split(";")[0].trim().toLowerCase();
  if (!SUPPORTED_EXTENSIONS.test(file.name) || (mime && !SUPPORTED_TYPES.has(mime))) {
    return apiError("Unsupported recording format. Use WebM, MP4, M4A, MP3, MPEG, MPGA, WAV, OGG, or FLAC audio.", 415);
  }

  const language = form.get("language");
  if (language !== null && (typeof language !== "string" || (language !== "" && !isTranscriptionLanguage(language)))) {
    return apiError("Select a supported transcription language.", 400);
  }

  try {
    const body = new FormData();
    body.append("file", file, file.name);
    body.append("model", "whisper-1");
    body.append("response_format", "json");
    if (typeof language === "string" && language) body.append("language", language);

    const response = await requestOpenAI("audio/transcriptions", "Audio transcription", {
      method: "POST",
      body,
    });
    const result = await response.json();
    if (typeof result?.text !== "string") {
      throw new AudioApiError("Audio transcription returned an invalid response. Please try again.");
    }
    return NextResponse.json({ text: result.text.trim() }, { headers: NO_STORE_HEADERS });
  } catch (error) {
    return handleApiError(error, "Audio transcription");
  }
}
