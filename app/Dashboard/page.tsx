"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChatOpenAI } from "@langchain/openai";
import axios from "axios";

type ConversationEntry = {
  from: string;
  text: string;
};

export default function Dashboard() {
  const [conversation, setConversation] = useState<ConversationEntry[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [username, setUsername] = useState<string>(""); 
  const [isRecognitionReady, setIsRecognitionReady] = useState(false); 
  const recognitionRef = useRef<Window["SpeechRecognition"] | null>(null);

  const model = new ChatOpenAI({
    openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
    temperature: 0.5,
    modelName: "gpt-3.5-turbo",
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
        console.log('User data:', response.data);
        const userLanguage = response.data.learningLanguage as string;
        setUsername(response.data.username); 

        if ('webkitSpeechRecognition' in window) {
          const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
          recognitionRef.current = new SpeechRecognition(); 
          console.log(recognitionRef);
          recognitionRef.current.lang = userLanguage;
          recognitionRef.current.interimResults = false;
          recognitionRef.current.maxAlternatives = 1;
          setIsRecognitionReady(true); 

          recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
            console.log("Speech recognized"); 
            const last = event.results.length - 1;
            const text = event.results[last][0].transcript;
            setConversation(prev => [...prev, { from: username, text }]);
            handleChatResponse(text);
          };

          recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error('Speech recognition error', event.error);
          };

          recognitionRef.current.onend = () => {
            console.log("Speech recognition ended"); 
            setIsListening(false);
          };
        } else {
          alert("Your browser does not support speech recognition.");
        }
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, [handleChatResponse, username]);

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
          <h1 className="text-5xl font-bold">Welcome, {username}</h1>
          <p className="mt-9 mb-9 text-xl">
            Practice conversations in your chosen language.
          </p>
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
