"use client";
import React, { FC } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const Header: FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "GET" });
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="bg-blue-500 text-white p-4 fixed top-0 left-0 right-0 z-10">
      <div className="mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Image src="/logo.png" alt="our logo" width={90} height={90} />
          <h1 className="text-5xl font-bold ml-9">LingoListen AI</h1>
        </div>
        <nav>
          <ul className="flex space-x-9 mr-9">
            <li className="hover:scale-110 transition duration-300 text-xl">
              <Link
                href="/LanguageSelection"
                className="hover:scale-110 transition duration-300 text-xl"
              >
                Language Settings
              </Link>
            </li>
            <li className="hover:scale-110 transition duration-300 text-xl">
              <Link href="/ManageSubscription">Manage Subscription</Link>
            </li>
            <li className="hover:scale-110 transition duration-300 text-xl">
              <button onClick={handleLogout}>Log Out</button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
