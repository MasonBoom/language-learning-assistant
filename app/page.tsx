"use client";
import ThreeScene from "../components/globe";

export default function Home() {
  return (
    <main>
      <section className="text-center p-10 bg-blue-500 text-white">
        <h1 className="text-4xl font-bold">Welcome to LingoListen AI!</h1>
        <p className="mt-3">
          Master Conversations in Any Language with AI with our interactive
          AI-powered language learning assistant
        </p>
        <button className="mt-4 bg-white text-blue-500 px-5 py-2 rounded">
          Start Learning
        </button>
      </section>
      <section className="py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-600">Simple steps to language mastery</p>
        </div>

        <div className="flex justify-center items-center space-x-8">
          <div className="text-center w-96">
            <div className="mb-2">
              <img
                src="/microphone.svg"
                alt="Speak"
                className="mx-auto h-12 w-12"
              />
            </div>
            <h3 className="font-semibold">Speak into the Microphone</h3>
            <p className="text-gray-600 mt-1">
              Start a conversation by speaking a phrase or sentence in your
              target language.
            </p>
          </div>
          <div className="text-center w-96">
            <div className="mb-2">
              <img
                src="/ai.png"
                alt="AI Response"
                className="mx-auto h-12 w-12"
              />
            </div>
            <h3 className="font-semibold">AI Generates Response</h3>
            <p className="text-gray-600 mt-1">
              Our AI analyzes and provides feedback or a conversational
              response.
            </p>
          </div>
          <div className="text-center w-96">
            <div className="mb-2">
              <img
                src="/target.svg"
                alt="Practice"
                className="mx-auto h-12 w-12"
              />
            </div>
            <h3 className="font-semibold">Practice and Learn</h3>
            <p className="text-gray-600 mt-1">
              Engage in interactive exercises to improve your conversational
              skills.
            </p>
          </div>
        </div>
      </section>
      <section>
        <ThreeScene />
      </section>
    </main>
  );
}
