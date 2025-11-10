"use client";
export const dynamic = "force-dynamic";
import React, { useState, useRef, useCallback } from "react";
import Loading from "@/components/loading";
import useUserData from "@/components/customHooks/useUserData";
import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import MicToggle from "@/components/micToggle";

type ConversationEntry = {
  from: string;
  text: string;
};

type DifficultyLevel = "Beginner" | "Intermediate" | "Expert" | "Fluent";

export default function Dashboard() {
  const { userData, isLoading, error } = useUserData();
  const [conversation, setConversation] = useState<ConversationEntry[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const beginnerPrompt = `Your name is no longer ChatGPT or OpenAI. Your name is LingoListen AI. You are a language learning assistant. Imagine you are talking to someone who is just learning ${userData.learningLanguage}. Respond by asking them how their day was or how they are doing. Keep your sentences short, simple, and easy to understand. Please reply with only one or two sentences at a time unless the user shows signs of increased proficiency. You are to only reply to the user in ${userData.learningLanguage} no matter what.`;
  const intermediatePrompt = `Your name is no longer ChatGPT or OpenAI. Your name is LingoListen AI. You are a language learning assistant. Engage in conversations about daily routines, hobbies, and interests with someone who has a basic understanding of ${userData.learningLanguage}. Use moderately complex sentences, encourage the user to expand their vocabulary. Reply with two to three sentences, gradually introducing new words and phrases. You are to only reply to the user in ${userData.learningLanguage} no matter what.`;
  const expertPrompt = `Your name is no longer ChatGPT or OpenAI. Your name is LingoListen AI. You are a language learning assistant. Dive into abstract topics, current events, or cultural differences. Challenge the user with complex sentence structures and nuanced vocabulary. Engage in debates or thought-provoking discussions, responding in detailed paragraphs. Encourage expression of opinions and feelings, and refine idiomatic expressions and advanced language concepts. You are to only reply to the user in ${userData.learningLanguage} no matter what.`;
  const fluentPrompt = `Your name is no longer ChatGPT or OpenAI. Your name is LingoListen AI. You are a language learning assistant. Discuss complex subjects like history, philosophy, or technology. Focus on the subtleties of ${userData.learningLanguage}, idiomatic expressions, and cultural references. Engage in long-form discussions, using sophisticated and intricate language structures. Provide detailed responses, mimicking the fluency of a native speaker, to help the user perfect their command of ${userData.learningLanguage}. You are to only reply to the user in ${userData.learningLanguage} no matter what.`;

  const prompts = {
    Beginner: beginnerPrompt,
    Intermediate: intermediatePrompt,
    Expert: expertPrompt,
    Fluent: fluentPrompt,
  };

  const prompt = prompts[userData.difficulty as DifficultyLevel];

  const maxTokensByDifficulty = {
    Beginner: 30,
    Intermediate: 70,
    Expert: 150,
    Fluent: 350,
  };
  const setMaxTokens =
    maxTokensByDifficulty[userData.difficulty as DifficultyLevel];

  const model = new ChatOpenAI({
    openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
    temperature: 0.5,
    modelName: "gpt-4",
    maxTokens: setMaxTokens,
  });

  const difficultyTips: Record<DifficultyLevel, string> = {
    Beginner:
      "Tip: Start with basic greetings and everyday phrases. Practice simple sentences and common questions. For example, 'How are you?', 'What is your name?', or 'Where are you from?'.",
    Intermediate:
      "Tip: Engage in conversations about familiar topics like daily routines, hobbies, and interests. Try to expand your vocabulary and use more complex sentence structures. For instance, discuss your favorite movie or describe your typical day.",
    Expert:
      "Tip: Challenge yourself with abstract and nuanced topics. Engage in debates or discussions about current events, cultural differences, or professional topics. Try to express your opinions and feelings more intricately.",
    Fluent:
      "Tip: Immerse yourself in the subtleties and idiomatic expressions of the language. Engage in long-form discussions about complex subjects like history, philosophy, or technology. Focus on refining your accent and fluency to sound more like a native speaker.",
  };

  const languageToISO: Record<string, string> = {
    spanish: "es",
    english: "en",
    french: "fr",
    german: "de",
    italian: "it",
    portuguese: "pt",
    japanese: "ja",
    chinese: "zh",
    korean: "ko",
    arabic: "ar",
    hindi: "hi",
    russian: "ru",
    turkish: "tr",
    dutch: "nl",
    swedish: "sv",
    norwegian: "no",
    danish: "da",
    polish: "pl",
    greek: "el",
  };

  const isoLanguage =
    languageToISO[(userData.learningLanguage || "").toLowerCase()] || "";
  const uid = () =>
    (globalThis.crypto?.randomUUID?.() ||
      Math.random().toString(36).slice(2)) as string;

  const handleRecordingToggle = async () => {
    const rec = mediaRecorderRef.current;

    if (isRecording && rec) {
      try {
        if (rec.state === "recording") {
          const stopped = new Promise<void>((resolve, reject) => {
            const onStop = () => {
              rec.removeEventListener("stop", onStop);
              rec.removeEventListener("error", onError as EventListener);
              resolve();
            };
            const onError = (ev: Event) => {
              const err =
                (ev as any)?.error ??
                new Error("MediaRecorder error (no detail)");
              rec.removeEventListener("stop", onStop);
              rec.removeEventListener("error", onError as EventListener);
              reject(err);
            };
            rec.addEventListener("stop", onStop, { once: true });
            rec.addEventListener("error", onError as EventListener, {
              once: true,
            });
          });

          try {
            rec.requestData(); 
          } catch {
            console.warn("Failed to request data from MediaRecorder");
          }
          rec.stop();

          await stopped;
        }
      } finally {
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        mediaRecorderRef.current = null;
        setIsRecording(false);
      }
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });
    streamRef.current = stream;

    const preferredMime =
      MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/mp4")
        ? "audio/mp4"
        : "";

    const mediaRecorder = new MediaRecorder(
      stream,
      preferredMime ? { mimeType: preferredMime } : undefined
    );
    mediaRecorderRef.current = mediaRecorder;

    let audioChunks: BlobPart[] = [];
    let chunkCount = 0;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        audioChunks.push(event.data);
        chunkCount++;
      }
    };

    mediaRecorder.onstop = async () => {
      try {
        const type =
          mediaRecorder.mimeType || preferredMime || "audio/webm;codecs=opus";
        const audioBlob = new Blob(audioChunks, { type });
        const size = audioBlob.size;
        const ext = type.includes("mp4") ? "mp4" : "webm";
        audioChunks = []; 

        console.log(
          "[Recorder] mime:",
          type,
          "chunks:",
          chunkCount,
          "bytes:",
          size
        );
        if (!size || size < 1024) {
          console.warn(
            "Audio blob is very small; likely silence or recording did not start correctly."
          );
        }

        await transcribeAudio(audioBlob, ext);
      } catch (e) {
        console.error("onstop processing failed:", e);
      }
    };

    mediaRecorder.start(250);
    setIsRecording(true);
  };

  const transcribeAudio = async (audioBlob: Blob, ext: "webm" | "mp4") => {
    const formData = new FormData();
    const filename = `audio-${uid()}.${ext}`;
    const file = new File([audioBlob], filename, { type: audioBlob.type });
    formData.append("file", file);
    formData.append("model", "whisper-1");
    if (isoLanguage) formData.append("language", isoLanguage);
    formData.append("response_format", "json");

    try {
      const response = await fetch(
        `https://api.openai.com/v1/audio/transcriptions?ts=${Date.now()}`,
        {
          method: "POST",
          cache: "no-store",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_KEY}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        console.error("Transcription status:", response.status);
        console.error("Transcription body:", await response.text());
        throw new Error(`Transcription failed: ${response.statusText}`);
      }

      const data = await response.json();
      const text = (data?.text ?? "").toString().trim();
      console.log("[Whisper] text:", text);
      handleChatResponse(text || "[no speech detected]");
    } catch (err) {
      console.error("Error transcribing audio:", err);
    }
  };

  const convertTextToSpeech = async (text: string) => {
    try {
      const response = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "tts-1-hd",
          voice: "alloy",
          input: text,
        }),
      });

      if (!response.ok) {
        console.error("TTS status:", response.status, await response.text());
        throw new Error(`TTS failed: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      playAudio(url);
    } catch (error) {
      console.error("Error with OpenAI TTS API:", error);
    }
  };

  const playAudio = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.playbackRate = 0.7;
    audio.play();
  };

  const handleChatResponse = useCallback(
    async (userInput: string) => {
      try {
        const sys = new SystemMessage(prompt);
        const human = new HumanMessage(userInput);
        const message = await model.invoke([sys, human]);
        const botReply = (message.content as string) ?? "";

        setConversation((prev) => [
          ...prev,
          { from: userData.username, text: userInput },
          { from: "LingoListen AI", text: botReply },
        ]);

        await convertTextToSpeech(botReply);
      } catch (error) {
        console.error("Error with OpenAI Chat API:", error);
      }
    },
    [model, prompt, userData.username]
  );

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <main className="bg-white text-blue-500 mb-32">
      <section className="text-center p-8 z-10">
        <h1 className="text-5xl font-bold">Welcome, {userData.username}</h1>
        <p className="mt-6 mb-3 text-xl">
          Practice conversations in {userData.learningLanguage}.
        </p>
        {userData.difficulty &&
          difficultyTips[userData.difficulty as DifficultyLevel] && (
            <p className="mb-4">
              {difficultyTips[userData.difficulty as DifficultyLevel]}
            </p>
          )}
        <div className="flex flex-col items-center">
          <span className="mb-4">
            Click to {isRecording ? "stop recording" : "start recording"}
          </span>
          <button onClick={handleRecordingToggle}>
            <MicToggle />
          </button>
        </div>
      </section>
      <section className="flex justify-center p-8">
        {conversation.length > 0 ? (
          <div className="chat-display bg-blue-500 text-white rounded p-4 w-1/2 md:text-lg text-sm overflow-y-scroll lg:max-h-96 md:max-h-72 sm:max-h-48">
            {conversation.map((entry, index) => (
              <p key={index}>
                {entry.from}: {entry.text}
              </p>
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}
