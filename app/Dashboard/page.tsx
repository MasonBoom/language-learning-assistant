"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import useUserData from "@/components/customHooks/useUserData";
import { ChatOpenAI } from "@langchain/openai";

type ConversationEntry = {
  from: string;
  text: string;
};

type DifficultyLevel = "Beginner" | "Intermediate" | "Expert" | "Fluent";

export default function Dashboard() {
  const { userData, isLoading, error } = useUserData();
  const [conversation, setConversation] = useState<ConversationEntry[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isRecognitionReady, setIsRecognitionReady] = useState(false);
  const recognitionRef = useRef<Window["SpeechRecognition"] | null>(null);

  const model = new ChatOpenAI({
    openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
    temperature: 0.5,
    modelName: "gpt-3.5-turbo-0125",
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

  const handleChatResponse = useCallback(async (userInput: string) => {
    try {
      const message = await model.invoke(userInput);
      const botReply = message.content as string;
      setConversation((prev) => [...prev, { from: "bot", text: botReply }]);
    } catch (error) {
      console.error("Error with OpenAI API:", error);
    }
  }, []);

  useEffect(() => {
    if (isLoading || error) {
      return;
    }

    if (userData) {
      const userLanguage = userData.learningLanguage;

      if ("webkitSpeechRecognition" in window) {
        const SpeechRecognition =
          window.SpeechRecognition || (window as any).webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.lang = userLanguage;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.maxAlternatives = 1;
        setIsRecognitionReady(true);

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          const last = event.results.length - 1;
          const text = event.results[last][0].transcript;
          setConversation((prev) => [
            ...prev,
            { from: userData.username, text },
          ]);
          handleChatResponse(text);
        };

        recognitionRef.current.onerror = (
          event: SpeechRecognitionErrorEvent
        ) => {
          console.error("Speech recognition error", event.error);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      } else {
        alert("Your browser does not support speech recognition.");
      }
    }
  }, [userData, handleChatResponse]);

  const toggleListening = () => {
    if (isRecognitionReady) {
      if (isListening) {
        recognitionRef.current.stop();
      } else {
        recognitionRef.current.start();
      }
      setIsListening(!isListening);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="mt-32">
      <main className="bg-white text-blue-500">
        <section className="text-center p-8 z-10">
          <h1 className="text-5xl font-bold">Welcome, {userData.username}</h1>
          <p className="mt-9 mb-3 text-xl">
            Practice conversations in {userData.learningLanguage}.
          </p>
          {userData.difficulty &&
            difficultyTips[userData.difficulty as DifficultyLevel] && (
              <p className="mb-24">
                {difficultyTips[userData.difficulty as DifficultyLevel]}
              </p>
            )}
          <button onClick={toggleListening}>
            {isListening ? "Stop" : "Start"} Voice Chat
          </button>
        </section>
        <section className="p-8">
          <div className="chat-display bg-white text-black rounded p-4">
            {conversation.map((entry, index) => (
              <p key={index}>
                {entry.from}: {entry.text}
              </p>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
