"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { AnimatedInput } from "@/components/animatedInput";

export default function SignUp() {
  const router = useRouter();
  const fieldStyles =
    "w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 duration-300";

  const [user, setUser] = useState({
    email: "",
    password: "",
    username: "",
  });

  const onSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .post("/api/signup", user)
      .then(() => {
        alert("User has been registered!");
        router.push("/Login");
      })
      .catch(() => console.log("Error: " + Error));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, email: e.target.value.toLowerCase() });
  };

  return (
    <form
      onSubmit={onSignUp}
      className="flex justify-center items-center h-screen bg-blue-500"
    >
      <div className="w-full max-w-xl sm:px-8 px-3 py-8 mt-4 text-left bg-white shadow-lg rounded-lg mb-12">
        <h3 className="text-2xl font-bold text-center text-blue-500">Join LingoListen AI</h3>
        <div className="mt-4">
          <AnimatedInput
            type="text"
            name="username"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            labelSpans={"First Name".split("")}
          />
          <AnimatedInput
            type="email"
            name="email"
            value={user.email}
            onChange={handleEmailChange}
            labelSpans={"Email".split("")}
          />
          <AnimatedInput
            type="password"
            name="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            labelSpans={"Password".split("")}
          />
          <div className="flex items-baseline justify-between">
            <button className="sm:px-6 px-2 py-2 mt-4 text-sm sm:text-md text-white bg-blue-500 rounded-lg hover:bg-blue-400 hover:shadow-sky-900 hover:shadow-md duration-300">
              Sign Up
            </button>
            <Link
              href="/Login"
              className="text-sm text-blue-600 hover:underline"
            >
              Already have an account?
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
}
