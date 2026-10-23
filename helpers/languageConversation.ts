export const LANGUAGE_CODES: Record<string, string> = {
  spanish: "es",
  english: "en",
  french: "fr",
  german: "de",
  italian: "it",
  portuguese: "pt",
  japanese: "ja",
  chinese: "zh",
  "chinese (mandarin)": "zh",
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

export type DifficultyLevel = "Beginner" | "Intermediate" | "Expert" | "Fluent";

export function conversationPrompt(language: string, difficulty: DifficultyLevel) {
  const introduction = "Your name is no longer ChatGPT or OpenAI. Your name is LingoListen AI. You are a language learning assistant.";
  const instructions: Record<DifficultyLevel, string> = {
    Beginner: `Imagine you are talking to someone who is just learning ${language}. Respond by asking them how their day was or how they are doing. Keep your sentences short, simple, and easy to understand. Please reply with only one or two sentences at a time unless the user shows signs of increased proficiency.`,
    Intermediate: `Engage in conversations about daily routines, hobbies, and interests with someone who has a basic understanding of ${language}. Use moderately complex sentences, encourage the user to expand their vocabulary. Reply with two to three sentences, gradually introducing new words and phrases.`,
    Expert: "Dive into abstract topics, current events, or cultural differences. Challenge the user with complex sentence structures and nuanced vocabulary. Engage in debates or thought-provoking discussions, responding in detailed paragraphs. Encourage expression of opinions and feelings, and refine idiomatic expressions and advanced language concepts.",
    Fluent: `Discuss complex subjects like history, philosophy, or technology. Focus on the subtleties of ${language}, idiomatic expressions, and cultural references. Engage in long-form discussions, using sophisticated and intricate language structures. Provide detailed responses, mimicking the fluency of a native speaker, to help the user perfect their command of ${language}.`,
  };
  return `${introduction} ${instructions[difficulty]} You are to only reply to the user in ${language} no matter what.`;
}

export function isDifficulty(value: unknown): value is DifficultyLevel {
  return typeof value === "string" && ["Beginner", "Intermediate", "Expert", "Fluent"].includes(value);
}

export function isLearningLanguage(value: unknown): value is string {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(LANGUAGE_CODES, value.trim().toLowerCase());
}

export function isTranscriptionLanguage(value: string) {
  return Object.values(LANGUAGE_CODES).includes(value);
}
