import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      enum: ["bull", "bear", "rocket", "chart", "diamond", "crown"],
      default: "bull",
    },
    balance: {
      type: Number,
      default: 100000,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
