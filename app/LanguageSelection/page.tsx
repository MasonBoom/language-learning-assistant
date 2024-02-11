"use client";
import React, { useState, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const LanguageSelection = () => {
  const router = useRouter();
  const [nativeLanguage, setNativeLanguage] = useState("");
  const [learningLanguage, setLearningLanguage] = useState("");

  const languages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Chinese",
    "Japanese",
  ];

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post("/api/languagePreferences", {
        nativeLanguage,
        learningLanguage,
        firstLogin: false,
      });
      router.push("/profile");
    } catch (error) {
      console.error("Error updating language preferences:", error);
    }
  };

  const buttonStyles = "mt-1 bg-white border-2 border-white text-blue-500 px-7 py-2 rounded duration-300 hover:bg-transparent hover:text-white";

  return (
    <div className="flex justify-center items-center w-full h-screen bg-blue-500">
    <div className="p-8 text-white xl:w-2/5 xl:mb-72">
      <h1 className="text-6xl font-bold mb-4">Welcome, User!</h1>
      <h2 className="mb-6 text-xl">Select your native language and the language you want to learn (you can change your selection later)</h2>
      <form onSubmit={handleSubmit} className="text-left">
        <div className="mb-4">
          <label className="block mb-2">
            Native Language:
          </label>
          <select
            className="border-2 border-white bg-transparent text-white rounded p-2 w-full"
            value={nativeLanguage}
            onChange={(e) => setNativeLanguage(e.target.value)}
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2">
            Language to Learn:
          </label>
          <select
            className="border-2 border-white bg-transparent text-white rounded p-2 w-full"
            value={learningLanguage}
            onChange={(e) => setLearningLanguage(e.target.value)}
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className={buttonStyles}>Save Preferences</button>
      </form>
    </div>
    </div>
  );
};

export default LanguageSelection;
