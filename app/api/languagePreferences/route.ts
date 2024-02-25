import { getDataFromToken } from "@/helpers/getDataFromToken";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const userId = getDataFromToken(request);

    const { nativeLanguage, learningLanguage, difficulty } = reqBody;

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    user.nativeLanguage = nativeLanguage;
    user.learningLanguage = learningLanguage;
    user.difficulty = difficulty;
    user.firstLogin = false;
    await user.save();

    return NextResponse.json({
      message: "Language preferences updated successfully",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
