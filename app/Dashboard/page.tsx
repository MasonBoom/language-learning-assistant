"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

type ConversationEntry = {
  from: string;
  text: string;
};

export default function Dashboard() {
  const [conversation, setConversation] = useState<ConversationEntry[]>([]);
  const [isListening, setIsListening] = useState(false);
  let recognition: Window["SpeechRecognition"] | null = null;

  useEffect(() => {
    axios.get('/api/getUserData')
      .then(response => {
        const userLanguage = response.data.learningLanguage as string;

        if ('webkitSpeechRecognition' in window) {
          const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
          recognition = new SpeechRecognition();
          
          recognition.lang = userLanguage; // Set language from user preference
          recognition.interimResults = false;
          recognition.maxAlternatives = 1;

          recognition.onresult = (event: SpeechRecognitionEvent) => {
            const last = event.results.length - 1;
            const text = event.results[last][0].transcript;
            setConversation(prev => [...prev, { from: 'user', text }]);
            // Handle the response from the chatbot here
          };

          recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error('Speech recognition error', event.error);
          };

          recognition.onend = () => {
            setIsListening(false);
          };
        } else {
          alert("Your browser does not support speech recognition.");
        }
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, []);

  const toggleListening = () => {
    if (isListening && recognition) {
      recognition.stop();
    } else if (recognition) {
      recognition.start();
    }
    setIsListening(!isListening);
  };

  return (
    <div>
      <main className="bg-white text-blue-500">
        <section className="text-center p-8 z-10">
          <h1 className="text-5xl font-bold">Dashboard</h1>
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
