"use client";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="text-center p-9 bg-blue-500 text-white z-10">
      <h1 className="text-5xl font-bold">Welcome to LingoListen AI!</h1>
      <p className="mt-9 mb-9 text-xl">
        Master Conversations in Any Language with AI with our interactive
        AI-powered language learning assistant
      </p>
      <Link
        href={"/SignUp"}
        className="bg-white text-blue-500 px-9 py-2 rounded"
      >
        Start Learning
      </Link>
      <span className="mx-5">Or</span>
      <Link
        href={"/LogIn"}
        className="mt-1 bg-transparent border-2 border-white text-white px-16 py-2 rounded"
      >
        Log In
      </Link>
    </section>
  );
}
