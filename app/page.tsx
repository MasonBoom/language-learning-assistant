"use client";
import HeroSection from "../components/heroSection";
import ThreeScene from "../components/globe";

export default function Home() {
  return (
    <main>
      <HeroSection/>
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
              Engage in voice conversations with AI to improve your
              conversational skills.
            </p>
          </div>
        </div>
      </section>
      <section className="flex justify-center">
        <ThreeScene />
      </section>
    </main>
  );
}
