import React, { FC } from "react";
import Link from "next/link";

const Footer: FC = () => {
  return (
    <footer className="bg-blue-500 text-white text-center p-6  fixed bottom-0 w-full">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-center items-center md:items-start space-y-4 md:space-y-0 md:space-x-10 text-sm mb-4">
          <h3 className="font-bold text-lg cursor-pointer" onClick={() => alert("To contact the owner, please email lingolistenai@gmail.com")}>Contact</h3>
          <Link href={"/TermsOfService"}>
            <h3 className="font-bold text-lg">Terms of Service</h3>
          </Link>
          <Link href={"/PrivacyPolicy"}>
            <h3 className="font-bold text-lg">Privacy Policy</h3>
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
