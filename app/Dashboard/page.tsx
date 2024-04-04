"use client";
import React, { useState, useRef, useCallback } from "react";
import Loading from "@/components/loading";
import useUserData from "@/components/customHooks/useUserData";
import { ChatOpenAI } from "@langchain/openai";
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

  const beginnerPrompt = `Your name is no longer ChatGPT or OpenAI. Your name is LingoListen AI. You are a language learning assistant. Imagine you are talking to someone who is just learning ${userData.learningLanguage}. Respond by asking them how their day was or how they are doing. Keep your sentences short, simple, and easy to understand. Please reply with only one or two sentences at a time unless the user shows signs of increased proficiency. You are to only reply to the user in ${userData.learningLanguage} no matter what. Here is the user's message to you, this will be the only part that you will respond to: `;
  const intermediatePrompt = `Your name is no longer ChatGPT or OpenAI. Your name is LingoListen AI. You are a language learning assistant. Engage in conversations about daily routines, hobbies, and interests with someone who has a basic understanding of ${userData.learningLanguage}. For instance, discuss favorite movies or describe typical days. Use moderately complex sentences, and encourage the user to expand their vocabulary. Reply with two to three sentences, gradually introducing new words and phrases. You are to only reply to the user in ${userData.learningLanguage} no matter what. Here is the user's message to you, this will be the only part that you will respond to: `;
  const expertPrompt = `Your name is no longer ChatGPT or OpenAI. Your name is LingoListen AI. You are a language learning assistant. Dive into abstract topics, current events, or cultural differences. Challenge the user with complex sentence structures and nuanced vocabulary. Engage in debates or thought-provoking discussions, responding in detailed paragraphs. Encourage expression of opinions and feelings, and use this opportunity to refine their understanding of idiomatic expressions and advanced language concepts. You are to only reply to the user in ${userData.learningLanguage} no matter what. Here is the user's message to you, this will be the only part that you will respond to: `;
  const fluentPrompt = `Your name is no longer ChatGPT or OpenAI. Your name is LingoListen AI. You are a language learning assistant. Discuss complex subjects like history, philosophy, or technology. Focus on the subtleties of ${userData.learningLanguage}, idiomatic expressions, and cultural references. Engage in long-form discussions, using sophisticated and intricate language structures. Provide detailed responses, mimicking the fluency and accent of a native speaker, to help the user perfect their command of ${userData.learningLanguage}. You are to only reply to the user in ${userData.learningLanguage} no matter what. Here is the user's message to you, this will be the only part that you will respond to: `;
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

  const handleRecordingToggle = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    } else {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      let audioChunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks);
        audioChunks = [];
        await transcribeAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append("file", audioBlob, "audio.mp3");
    formData.append("model", "whisper-1");

    console.log("Sending audio for transcription");

    try {
      const response = await fetch(
        "https://api.openai.com/v1/audio/transcriptions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_KEY}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        console.error("Response status:", response.status);
        console.error("Response body:", await response.text());
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Transcription data:", data);
      handleChatResponse(data.text);
    } catch (error) {
      console.error("Error transcribing audio:", error);
    }
  };

  const convertTextToSpeech = async (text: string) => {
    try {
      const response = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
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
        throw new Error(`Error: ${response.statusText}`);
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
        const message = await model.invoke(prompt + userInput);
        const botReply = message.content as string;

        setConversation((prev) => [
          ...prev,
          { from: userData.username, text: userInput },
          { from: "LingoListen AI", text: botReply },
        ]);

        await convertTextToSpeech(botReply);
      } catch (error) {
        console.error("Error with OpenAI API:", error);
      }
    },
    [model, prompt, convertTextToSpeech]
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
