"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

export default function SignUp() {
  const router = useRouter();
  const fieldStyles =
    "w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 duration-300";

  const [loading, setLoading] = useState(false);
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

  return (
    <form
      onSubmit={onSignUp}
      className="flex justify-center items-center h-screen bg-blue-500"
    >
      <div className="w-full max-w-xl px-8 py-8 mt-4 text-left bg-white shadow-lg">
        <h3 className="text-2xl font-bold text-center">Join LingoListen AI</h3>
        <div className="mt-4">
          <label className="block" htmlFor="Name">
            Name
          </label>
          <input
            type="text"
            placeholder="Name"
            className={fieldStyles}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
          />
          <label className="block mt-4" htmlFor="Email">
            Email
          </label>
          <input
            type="email"
            placeholder="Email"
            className={fieldStyles}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
          <label className="block mt-4">Password</label>
          <input
            type="password"
            placeholder="Password"
            className={fieldStyles}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />
          <div className="flex items-baseline justify-between">
            <button className="px-6 py-2 mt-4 text-white bg-blue-500 rounded-lg hover:bg-blue-400 hover:shadow-sky-900 hover:shadow-md duration-300">
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
