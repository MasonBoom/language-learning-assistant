"use client";
import Link from "next/link";
import React, { FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AnimatedInput } from "@/components/animatedInput";

export default function Login() {
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });

  const onLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      axios.post("/api/login", user).then((response) => {
        if (response.data.firstLogin) {
          router.push("/LanguageSelection");
        } else {
          router.push("/Dashboard");
        }
      });
    } catch (error: any) {
      console.log("General error", error.message);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, email: e.target.value.toLowerCase() });
  };

  return (
    <main className="flex justify-center items-center h-screen bg-blue-500">
      <div className="w-full max-w-lg px-8 py-8 text-left bg-white shadow-lg rounded-lg mb-12">
        <h3 className="text-2xl font-bold text-center text-blue-500">
          Login to LingoListen AI
        </h3>
        <form onSubmit={onLogin} className="mt-4">
          <div>
            <AnimatedInput
              type="email"
              name="email"
              value={user.email}
              onChange={handleEmailChange}
              labelSpans={"Email".split("")}
            />
          </div>
          <div className="mt-4">
            <AnimatedInput
              type="password"
              name="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              labelSpans={"Password".split("")}
            />
          </div>
          <div className="flex items-center justify-between mt-4">
            <button
              type="submit"
              className="px-6 py-2 mt-4 text-white bg-blue-500 rounded-lg hover:bg-blue-400 hover:shadow-sky-900 hover:shadow-md duration-300"
            >
              Log In
            </button>
            <Link
              href="/ForgotPassword"
              className="text-sm text-blue-600 cursor-pointer hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="text-center mt-4">
            <Link
              href="/SignUp"
              className="text-sm text-blue-600 hover:underline"
            >
              Don&apos;t have an account? Sign Up
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
