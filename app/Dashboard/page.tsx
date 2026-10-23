"use client";

import { useCallback, useEffect, useState } from "react";
import Loading from "@/components/loading";
import useUserData from "@/components/customHooks/useUserData";
import useAudioRecorder from "@/components/customHooks/useAudioRecorder";
import MicToggle from "@/components/micToggle";

type ConversationEntry = { from: string; text: string };
type DifficultyLevel = "Beginner" | "Intermediate" | "Expert" | "Fluent";

const difficultyTips: Record<DifficultyLevel, string> = {
  Beginner: "Tip: Start with basic greetings and everyday phrases. Practice simple sentences and common questions. For example, 'How are you?', 'What is your name?', or 'Where are you from?'.",
  Intermediate: "Tip: Engage in conversations about familiar topics like daily routines, hobbies, and interests. Try to expand your vocabulary and use more complex sentence structures. For instance, discuss your favorite movie or describe your typical day.",
  Expert: "Tip: Challenge yourself with abstract and nuanced topics. Engage in debates or discussions about current events, cultural differences, or professional topics. Try to express your opinions and feelings more intricately.",
  Fluent: "Tip: Immerse yourself in the subtleties and idiomatic expressions of the language. Engage in long-form discussions about complex subjects like history, philosophy, or technology. Focus on refining your accent and fluency to sound more like a native speaker.",
};

const languageToISO: Record<string, string> = {
  spanish: "es", english: "en", french: "fr", german: "de", italian: "it",
  portuguese: "pt", japanese: "ja", chinese: "zh", "chinese (mandarin)": "zh",
  korean: "ko", arabic: "ar", hindi: "hi", russian: "ru", turkish: "tr",
  dutch: "nl", swedish: "sv", norwegian: "no", danish: "da", polish: "pl", greek: "el",
};

async function checkResponse(response: Response, stage: string) {
  if (response.ok) return;
  const data = await response.json().catch(() => null);
  throw new Error(
    typeof data?.error === "string" ? data.error : `${stage} failed (${response.status}). Please try again.`
  );
}

function audioExtension(type: string) {
  if (type.includes("webm")) return "webm";
  if (type.includes("mp4")) return "mp4";
  if (type.includes("ogg")) return "ogg";
  if (type.includes("wav")) return "wav";
  throw new Error("This browser recorded an unsupported audio format. Please try another browser.");
}

export default function Dashboard() {
  const { userData, isLoading, error } = useUserData();
  const [conversation, setConversation] = useState<ConversationEntry[]>([]);
  const [processingMessage, setProcessingMessage] = useState("");
  const [replyAudioUrl, setReplyAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (replyAudioUrl) URL.revokeObjectURL(replyAudioUrl);
    };
  }, [replyAudioUrl]);

  const processRecording = useCallback(async (audio: Blob, signal: AbortSignal) => {
    if (audio.size > 25 * 1024 * 1024) {
      throw new Error("The recording is too large to transcribe. Please record a shorter message (under 25 MB).");
    }
    const formData = new FormData();
    formData.append("file", audio, `recording.${audioExtension(audio.type)}`);
    const isoLanguage = languageToISO[(userData.learningLanguage || "").toLowerCase()];
    if (isoLanguage) formData.append("language", isoLanguage);

    setProcessingMessage("Transcribing your recording…");
    const transcriptResponse = await fetch("/api/audio/transcribe", {
      method: "POST", body: formData, signal,
    });
    await checkResponse(transcriptResponse, "Transcription");
    const transcript = await transcriptResponse.json();
    const text = typeof transcript.text === "string" ? transcript.text.trim() : "";
    if (!text) throw new Error("No speech was detected. Check the recording preview and try speaking again.");
    if (signal.aborted) return;
    setConversation((previous) => [...previous, { from: userData.username, text }]);

    setProcessingMessage("Preparing your reply…");
    const chatResponse = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, language: userData.learningLanguage, difficulty: userData.difficulty }),
      signal,
    });
    await checkResponse(chatResponse, "Conversation");
    const chat = await chatResponse.json();
    const reply = typeof chat.text === "string" ? chat.text.trim() : "";
    if (!reply) throw new Error("The assistant returned an empty reply. Please try again.");
    if (signal.aborted) return;
    setConversation((previous) => [...previous, { from: "LingoListen AI", text: reply }]);

    setProcessingMessage("Preparing the voice reply…");
    const speechResponse = await fetch("/api/audio/speech", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: reply }),
      signal,
    });
    await checkResponse(speechResponse, "Voice reply");
    const speech = await speechResponse.blob();
    if (!speech.size) throw new Error("The voice reply was empty. Your text reply is available below.");
    if (!signal.aborted) setReplyAudioUrl(URL.createObjectURL(speech));
  }, [userData.learningLanguage, userData.difficulty, userData.username]);

  const { status, error: recordingError, recordingUrl, toggleRecording } = useAudioRecorder(processRecording);
  const isRecording = status === "recording";
  const isBusy = status !== "idle" && !isRecording;
  const statusText = {
    idle: "Click to start recording",
    requesting: "Waiting for microphone permission…",
    recording: "Recording… Click to stop recording",
    stopping: "Finishing your recording…",
    processing: processingMessage || "Processing your recording…",
  }[status];

  if (isLoading) return <Loading />;
  if (error) return <div>Error: {error}</div>;

  return (
    <main className="bg-white text-blue-500 mb-32">
      <section className="text-center p-8 z-10">
        <h1 className="text-5xl font-bold">Welcome, {userData.username}</h1>
        <p className="mt-6 mb-3 text-xl">Practice conversations in {userData.learningLanguage}.</p>
        {userData.difficulty && difficultyTips[userData.difficulty as DifficultyLevel] && (
          <p className="mb-4">{difficultyTips[userData.difficulty as DifficultyLevel]}</p>
        )}
        <div className="flex flex-col items-center gap-4">
          <span id="recording-status" role="status" aria-live="polite">{statusText}</span>
          <MicToggle
            isRecording={isRecording}
            disabled={isBusy}
            onClick={() => {
              if (status === "idle") setReplyAudioUrl(null);
              void toggleRecording();
            }}
          />
          {recordingError && <p role="alert" className="text-red-700 max-w-xl">{recordingError}</p>}
          {recordingUrl && (
            <div>
              <p className="mb-2">Your last recording</p>
              <audio key={recordingUrl} controls src={recordingUrl} aria-label="Your last recording" />
            </div>
          )}
          {replyAudioUrl && (
            <div>
              <p className="mb-2">AI-generated voice reply</p>
              <audio
                key={replyAudioUrl}
                controls
                autoPlay
                src={replyAudioUrl}
                aria-label="AI-generated voice reply"
                onLoadedMetadata={(event) => { event.currentTarget.playbackRate = 0.7; }}
              />
            </div>
          )}
        </div>
      </section>
      <section className="flex justify-center p-8">
        {conversation.length > 0 && (
          <div className="chat-display bg-blue-500 text-white rounded p-4 w-full md:w-1/2 md:text-lg text-sm overflow-y-auto lg:max-h-96 md:max-h-72 sm:max-h-48" aria-live="polite">
            {conversation.map((entry, index) => <p key={index}>{entry.from}: {entry.text}</p>)}
          </div>
        )}
      </section>
    </main>
  );
}
