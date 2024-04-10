import Link from "next/link";

export default function HeroSection() {
  const buttonStyles =
    "mt-1 bg-transparent border-2 border-white text-white px-7 py-2 rounded duration-300 hover:bg-white hover:text-blue-500";

  return (
    <section className="text-center p-8 bg-blue-500 text-white z-10">
      <h1 className="sm:text-5xl text-2xl font-bold">Welcome to LingoListen AI!</h1>
      <p className="sm:my-9 my-4 md:text-xl">
        Master Conversations in Any Language with AI with our interactive
        AI-powered language learning assistant
      </p>
      <div className="flex sm:flex-row flex-col justify-center">
        <Link href={"/SignUp"} className={buttonStyles}>
          Start Learning
        </Link>
        <span className="mx-5 self-center">Or</span>
        <Link href={"/Login"} className={buttonStyles}>
          <span className="mx-4">Log In</span>
        </Link>
      </div>
    </section>
  );
}
