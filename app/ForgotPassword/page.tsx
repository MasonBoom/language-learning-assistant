"use client";
import React, { useState } from "react";
import Link from "next/link";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch("/api/forgotPassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
  };

  const fieldStyles =
    "w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 duration-300";

  return (
    <main className="flex justify-center items-center h-screen bg-blue-500">
      <div className="w-full max-w-lg px-8 py-8 text-left bg-white shadow-lg rounded-lg mb-12">
        <h3 className="text-2xl font-bold text-center">
          Forgot Your Password?
        </h3>
        <form onSubmit={handleSubmit} className="mt-4">
          <div>
            <label className="block" htmlFor="Email">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={fieldStyles}
              placeholder="Enter your email"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 mt-4 text-white bg-blue-500 rounded-lg hover:bg-blue-400 hover:shadow-sky-900 hover:shadow-md duration-300"
          >
            Send Reset Email
          </button>
          <div className="text-center mt-4">
            <Link
              href="/Login"
              className="text-sm text-blue-600 hover:underline"
            >
              Remember your password? Log In
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
};

export default ForgotPassword;
