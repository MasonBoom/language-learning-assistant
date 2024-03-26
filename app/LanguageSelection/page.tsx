"use client";
import React, { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";
import useUserData from "@/components/customHooks/useUserData";

const LanguageSelection = () => {
  const router = useRouter();
  const { userData, isLoading, error } = useUserData();
  const [nativeLanguage, setNativeLanguage] = useState(userData.nativeLanguage);
  const [learningLanguage, setLearningLanguage] = useState(
    userData.learningLanguage
  );
  const [difficulty, setDifficulty] = useState(userData.difficulty);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    if (userData && !isLoading && !error) {
      setNativeLanguage(userData.nativeLanguage);
      setLearningLanguage(userData.learningLanguage);
      setDifficulty(userData.difficulty);
    }
  }, [userData, isLoading, error]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const difficultyLevels = ["Beginner", "Intermediate", "Expert", "Fluent"];

  const languages = [
    "English",
    "Spanish",
    "Portuguese",
    "French",
    "Italian",
    "Polish",
    "Romanian",
    "Dutch",
    "Turkish",
    "Swedish",
    "Vietnamese",
    "Indonesian",
    "Danish",
    "Norwegian",
    "Czech",
    "Catalan",
    "Croatian",
    "Hungarian",
    "Finnish",
    "Slovak",
    "Galician",
    "Slovenian",
    "Bosnian",
    "Afrikaans",
    "Welsh",
    "Estonian",
    "Latvian",
    "Lithuanian",
    "Malay",
    "Tagalog",
    "Swahili",
  ];

  const nonLatinLanguages = [
    "Chinese (Mandarin)",
    "Hindi",
    "Russian",
    "Arabic",
    "Bengali",
    "Japanese",
    "Urdu",
    "Korean",
    "Tamil",
    "Thai",
    "Persian (Farsi)",
    "Gujarati",
    "Kannada",
    "Greek",
    "Hebrew",
    "Azerbaijani",
    "Kazakh",
    "Armenian",
    "Belarusian",
    "Macedonian",
    "Serbian",
    "Ukrainian",
    "Bulgarian",
    "Nepali",
    "Maori",
  ];

  const allLanguages = [...languages, ...nonLatinLanguages];

  const handleLanguageChange = (language: string) => {
    setLearningLanguage(language);
    if (nonLatinLanguages.includes(language)) {
      setShowText(true);
    } else {
      setShowText(false);
    }
  };

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
              onChange={(e) => handleLanguageChange(e.target.value)}
            >
              {allLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
            {showText && (
              <p className="mt-2 text-md">
                Warning: Languages that don&apos;t use a Latin-based script may have
                limited support for audio transcription. We recommend practicing
                in Latin-based languages unless your pronunciation in the
                selected language is very clear.
              </p>
            )}
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
