import React, { FC } from "react";
import Link from "next/link";

const Footer: FC = () => {
  return (
    <footer className="bg-blue-500 text-white text-center md:p-8 sm:p-6 p-3 fixed bottom-0 w-full">
      <div className="container mx-auto">
        <div className="flex flex-row justify-center items-center space-y-0 space-x-10 text-sm sm:mb-4 mb-2">
          <Link href="/Contact">
            <h3 className="font-bold sm:text-lg cursor-pointer">Contact</h3>
          </Link>
          <Link href="/TermsOfService">
            <h3 className="font-bold sm:text-lg">Terms of Service</h3>
          </Link>
          <Link href="/PrivacyPolicy">
            <h3 className="font-bold sm:text-lg">Privacy Policy</h3>
          </Link>
        </div>
        <p className="text-xs mt-6">
          © {new Date().getFullYear()} LingoListen AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
