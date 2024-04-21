import { NextResponse } from "next/server";
import User from "@/models/userModel";

export async function GET(request: Request) {
  try {
    const userId = request.headers.get('Authorization'); // Assuming you pass the user ID or token here
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      hasTrial: user.subscription?.hasTrial,
      trialStart: user.subscription?.trialStart,
      isSubscribed: user.subscription?.isActive,
      trialEnd: user.subscription?.trialEnd
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}