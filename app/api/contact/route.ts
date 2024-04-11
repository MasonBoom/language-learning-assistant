import { NextResponse } from "next/server";
import sendEmail from "@/helpers/sendEmail";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    const htmlContent = `
      <p>You have received a new message from the contact form:</p>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;

    await sendEmail({
      to: process.env.EMAIL!,
      subject: `New Contact Form Submission from ${name}`,
      html: htmlContent,
    });

    return NextResponse.json({ message: "Message sent successfully" });
  } catch (error: any) {
    console.error("Error sending message:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
