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
    <header className="bg-blue-500 text-white p-4 z-10">
      <div className="mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Image
            src="/logo.png"
            alt="LingoListen AI Logo"
            width={90}
            height={90}
            className="lg:block hidden"
          />
          <h1 className="lg:text-5xl md:text-3xl font-bold lg:ml-9">
            LingoListen AI
          </h1>
        </div>
        <nav>
          <ul className="flex flex-col sm:flex-row sm:space-x-6 lg:space-x-9 sm:mr-9">
            <li className="hover:scale-110 transition duration-300 text-sm lg:text-xl">
              <Link href="/LanguageSelection">Language Settings</Link>
            </li>
			{/* Added Manage Subscription link
            <li className="hover:scale-110 transition duration-300 text-sm lg:text-xl">
              <Link href="/ManageSubscription">Manage Subscription</Link>
            </li>
			*/}
            <li className="hover:scale-110 transition duration-300 text-sm lg:text-xl">
              <button onClick={handleLogout}>Log Out</button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
