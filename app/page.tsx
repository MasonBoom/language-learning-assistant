"use client";
import HeroSection from "../components/heroSection";
import ThreeScene from "../components/globe";
import useUserData from "@/components/customHooks/useUserData";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const { userData } = useUserData();
  const router = useRouter();

  if (userData) {
    router.push("/Dashboard");
  }

  return (
    <main>
      <HeroSection />
      <section className="md:py-12 py-5">
        <div className="text-center md:mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-600">Simple steps to language mastery</p>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center">
          <div className="text-center lg:w-96 w-64 lg:mx-0 mx-9 md:my-0 my-9">
            <div className="mb-2">
              <Image
                src="/microphone.svg"
                alt="Speak"
                width={48}
                height={48}
                className="mx-auto"
              />
            </div>
            <h3 className="font-semibold">Speak into the Microphone</h3>
            <p className="text-gray-600 mt-1">
              Start a conversation by speaking a phrase or sentence in your
              target language.
            </p>
          </div>
          <div className="text-center lg:w-96 w-64 lg:mx-0 mx-9 md:my-0 my-9">
            <div className="mb-2">
              <Image
                src="/ai.png"
                alt="AI Response"
                width={48}
                height={48}
                className="mx-auto h-12 w-12"
              />
            </div>
            <h3 className="font-semibold">AI Generates Response</h3>
            <p className="text-gray-600 mt-1">
              Our AI analyzes and provides feedback or a conversational
              response.
            </p>
          </div>
          <div className="text-center lg:w-96 w-64 lg:mx-0 mx-9 md:my-0 my-9">
            <div className="mb-2">
              <Image
                src="/target.svg"
                alt="Practice"
                width={48}
                height={48}
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
      <section className="md:flex hidden justify-center">
        <ThreeScene />
      </section>
    </main>
  );
}
