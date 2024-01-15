import Link from "next/link";

export default function HeroSection() {
  const buttonStyles = "mt-1 bg-transparent border-2 border-white text-white px-7 py-2 rounded duration-300 hover:bg-white hover:border-none hover:text-blue-500"

  return (
    <section className="text-center p-8 bg-blue-500 text-white z-10">
      <h1 className="text-5xl font-bold">Welcome to LingoListen AI!</h1>
      <p className="mt-9 mb-9 text-xl">
        Master Conversations in Any Language with AI with our interactive
        AI-powered language learning assistant
      </p>
      <Link
        href={"/SignUp"}
        className={buttonStyles}
      >
        Start Learning
      </Link>
      <span className="mx-5">Or</span>
      <Link
        href={"/LogIn"}
        className={buttonStyles}
      >
        <span className="mx-4">Log In</span>
      </Link>
    </section>
  );
}
