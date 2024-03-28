import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a username"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please provide a email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  nativeLanguage: {
    type: String,
    default: "English",
  },
  learningLanguage: {
    type: String,
    default: "English",
  },
  difficulty: {
    type: String,
    default: "Beginner",
  },
  firstLogin: {
    type: Boolean,
    default: true,
  },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,
});

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;
