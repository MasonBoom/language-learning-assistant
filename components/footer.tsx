"use client";
import React, { FC } from "react";

const Footer: FC = () => {
  return (
    <footer className="bg-blue-500 text-white text-center p-6  fixed bottom-0 w-full">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-center items-center md:items-start space-y-4 md:space-y-0 md:space-x-10 text-sm mb-4">
          <div>
            <h3 className="font-bold text-lg">Contact</h3>
          </div>
          <div>
            <h3 className="font-bold text-lg">Terms of Service</h3>
          </div>
          <div>
            <h3 className="font-bold text-lg">Privacy Policy</h3>
          </div>
        </div>

        <p className="text-xs mt-6">
          © {new Date().getFullYear()} LingoListen AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
