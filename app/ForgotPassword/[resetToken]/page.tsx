"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const ResetPassword = () => {
  const pathname = usePathname();
  const resetToken = pathname.split("/ForgotPassword/")[1];
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/resetPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resetToken, newPassword }),
      });
      const data = await response.json();
      if (data.error) {
        setMessage(data.error);
      } else {
        setMessage(
          "Password reset successfully. You can now log in with your new password."
        );
      }
    } catch (error) {
      setMessage("An error occurred while resetting the password.");
    }
  };

  const fieldStyles =
    "w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 duration-300";

  return (
    <main className="flex justify-center items-center h-screen bg-blue-500">
      <div className="w-full max-w-lg px-8 py-8 text-left bg-white shadow-lg rounded-lg mb-12">
        <h3 className="text-2xl font-bold text-center">Reset Your Password</h3>
        <form onSubmit={handleSubmit} className="mt-4">
          <div>
            <label className="block">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className={fieldStyles}
            />
          </div>
          <div className="flex items-center justify-between mt-4">
            <button
              type="submit"
              className="px-6 py-2 mt-4 text-white bg-blue-500 rounded-lg hover:bg-blue-400 hover:shadow-sky-900 hover:shadow-md duration-300"
            >
              Reset Password
            </button>
            <Link
              href="/Login"
              className="text-sm text-blue-600 cursor-pointer hover:underline"
            >
              Log In
            </Link>
          </div>
          {message && (
            <div className="mt-4 text-center text-blue-500">{message}</div>
          )}
        </form>
      </div>
    </main>
  );
};

export default ResetPassword;
