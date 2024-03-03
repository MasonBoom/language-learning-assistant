"use client";
import React, { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import useUserData from "@/components/customHooks/useUserData";

const LanguageSelection = () => {
  const router = useRouter();
  const { userData, isLoading, error } = useUserData();
  const [nativeLanguage, setNativeLanguage] = useState(userData.nativeLanguage);
  const [learningLanguage, setLearningLanguage] = useState(userData.learningLanguage);
  const [difficulty, setDifficulty] = useState(userData.difficulty);

  useEffect(() => {
    if (userData && !isLoading && !error) {
      setNativeLanguage(userData.nativeLanguage);
      setLearningLanguage(userData.learningLanguage);
      setDifficulty(userData.difficulty);
    }
  }, [userData, isLoading, error]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const difficultyLevels = ["Beginner", "Intermediate", "Expert", "Fluent"];

  const languages = [
    "English",
    "Spanish",
    "German",
    "French",
    "Portuguese",
    "Russian",
    "Indonesian",
    "Bengali",
    "Korean",
    "Vietnamese",
    "Turkish",
    "Italian",
    "Polish",
    "Dutch",
    "Thai", 
    "Urdu",
    "Romanian",
    "Czech",
    "Gujarati",
    "Malay",
    "Ukrainian",
    "Slovak",
    "Danish",
    "Swedish",
    "Catalan",
    "Hungarian",
    "Croatian",
    "Slovenian",
    "Marathi",
    "Tamil",
    "Telugu",
    "Kannada",
    "Malayalam",
  ];

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (nativeLanguage === learningLanguage) {
      alert("Native language and learning language must be different.");
      return;
    }
    try {
      await axios.post("/api/languagePreferences", {
        nativeLanguage,
        learningLanguage,
        difficulty,
        firstLogin: false,
      });
      router.push("/Dashboard");
    } catch (error) {
      console.error("Error updating language preferences:", error);
    }
  };

  const buttonStyles =
    "mt-1 bg-white border-2 border-white text-blue-500 px-7 py-2 rounded duration-300 hover:bg-transparent hover:text-white";
  const selectStyles =
    "border-2 border-white bg-blue-100 text-blue-500 rounded p-2 w-56";

  return (
    <div className="flex justify-center items-center w-full h-screen bg-blue-500">
      <div className="p-8 text-white xl:w-2/5 xl:mb-72">
        {userData.firstLogin ? (
          <h1 className="text-6xl font-bold mb-4">
            Welcome, {userData.username}!
          </h1>
        ) : null}
        <h2 className="mb-6 text-xl">
          Select your native language and the language you want to learn{" "}
          {userData.firstLogin ? "(you can change your selection later)" : null}
        </h2>
        <form onSubmit={handleSubmit} className="text-left">
          <div className="mb-4">
            <label className="block mb-2">Native Language:</label>
            <select
              className={selectStyles}
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
            <label className="block mb-2">Language to Learn:</label>
            <select
              className={selectStyles}
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
          <div className="mb-4">
            <label className="block mb-2">Difficulty Level:</label>
            <select
              className={selectStyles}
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              {difficultyLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className={buttonStyles}>
            Save Preferences
          </button>
        </form>
      </div>
    </div>
  );
};

export default LanguageSelection;
