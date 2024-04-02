import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse } from "next/server";
import crypto from "crypto";
import sendEmail from "@/helpers/sendEmail";

connect();

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000;

    await User.findOneAndUpdate(
      { email },
      {
        forgotPasswordToken: resetToken,
        forgotPasswordTokenExpiry: resetTokenExpiry,
      }
    );

    const resetUrl = `http://localhost:3000/ForgotPassword/${resetToken}`;
    await sendEmail({
      to: email,
      subject: "Password Reset",
      html: `Please click on the link to reset your password: <a href="${resetUrl}">${resetUrl}</a>`,
    });

    return NextResponse.json({ message: "Password reset email sent." });
  } catch (error: any) {
    console.error("Forgot Password Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
