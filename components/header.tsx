"use client";
import React, { FC } from "react";
import Link from "next/link";
import Image from "next/image";

const Header: FC = () => {
  return (
    <header className="bg-blue-500 text-white p-4">
      <div className="mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Image src="/logo.png" alt="our logo" width={90} height={90} />
          <h1 className="text-5xl font-bold ml-9">LingoListen AI</h1>
        </div>
        <nav>
          <ul className="flex space-x-9">
            <li>
              <Link href="/about" className="hover:text-blue-300 text-xl">
                About
              </Link>
            </li>
            <li>
              <Link href="/features" className="hover:text-blue-300 text-xl">
                Manage Subscription
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-blue-300 text-xl">
                Log Out
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
