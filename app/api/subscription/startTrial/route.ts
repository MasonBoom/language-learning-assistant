import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

connect();

export async function POST(request: Request) {
  try {
    const reqBody = await request.json();
    const { userId } = reqBody;

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.subscription?.isActive || user.subscription?.trialStart) {
      return NextResponse.json(
        { error: "Subscription or trial already active" },
        { status: 400 }
      );
    }

    const now = new Date();
    user.subscription = {
      isActive: false,
      trialStart: now,
      trialEnd: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
    };
    await user.save();

    const tokenData = {
      id: user._id,
      email: user.email,
      subscription: user.subscription
    };

    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "7d",  
    });

    const response = NextResponse.json({
      message: "Trial started successfully",
      success: true,
      trialEnd: user.subscription.trialEnd,
    });
    response.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "strict"
    });
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
