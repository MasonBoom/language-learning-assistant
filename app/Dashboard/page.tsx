"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChatOpenAI } from "@langchain/openai";
import axios from "axios";

type ConversationEntry = {
  from: string;
  text: string;
};

export default function Dashboard() {
  const [userData, setUserData] = useState({} as any)
  const [conversation, setConversation] = useState<ConversationEntry[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isRecognitionReady, setIsRecognitionReady] = useState(false); 
  const recognitionRef = useRef<Window["SpeechRecognition"] | null>(null);

  const model = new ChatOpenAI({
    openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
    temperature: 0.5,
    modelName: "gpt-3.5-turbo-0125",
  });

  const handleChatResponse = useCallback(async (userInput: string) => {
    try {
      const message = await model.invoke(userInput);
      const botReply = message.content as string;
      setConversation(prev => [...prev, { from: 'bot', text: botReply }]);
    } catch (error) {
      console.error('Error with OpenAI API:', error);
      // Handle error appropriately
    }
  }, []);

  useEffect(() => {
    axios.get('/api/getUserData')
      .then(response => {
        setUserData(response.data);
        const userLanguage = response.data.learningLanguage as string;

        if ('webkitSpeechRecognition' in window) {
          const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
          recognitionRef.current = new SpeechRecognition(); 
          recognitionRef.current.lang = userLanguage;
          recognitionRef.current.interimResults = false;
          recognitionRef.current.maxAlternatives = 1;
          setIsRecognitionReady(true); 

          recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
            const last = event.results.length - 1;
            const text = event.results[last][0].transcript;
            setConversation(prev => [...prev, { from: response.data.username, text }]);
            handleChatResponse(text);
          };

          recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error('Speech recognition error', event.error);
          };

          recognitionRef.current.onend = () => {
            setIsListening(false);
          };
        } else {
          alert("Your browser does not support speech recognition.");
        }
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, [handleChatResponse, setUserData]);

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

  return (
    <div>
      <main className="bg-white text-blue-500">
        <section className="text-center p-8 z-10">
          <h1 className="text-5xl font-bold">Welcome, {userData.username}</h1>
          <p className="mt-9 mb-3 text-xl">
            Practice conversations in {userData.learningLanguage}.
          </p>
          {userData.difficulty === "Beginner" ? <p className="mb-24">Tip: Start the conversation with a simple introduction</p> : null}
          {
          // Add more tips for different difficulty levels
          }
          <button onClick={toggleListening}>
            {isListening ? 'Stop' : 'Start'} Voice Chat
          </button>
        </section>
        <section className="p-8">
          <div className="chat-display bg-white text-black rounded p-4">
            {conversation.map((entry, index) => (
              <p key={index}>{entry.from}: {entry.text}</p>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
