
import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";


const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("Add MONGODB_URI to your .env.local");
mongoose.connect(uri);

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: String,
  pbkdf2Salt: String,
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Only POST allowed" });

  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: "User already exists" });

  
    const passwordHash = await bcrypt.hash(password, 10);
    const pbkdf2Salt = crypto.randomBytes(16).toString("base64");

    const newUser = new User({ email, passwordHash, pbkdf2Salt });
    await newUser.save();

    return res.status(201).json({
      ok: true,
      pbkdf2Salt,
      userId: newUser._id,
    });
  } catch (err: any) {
    console.error("Signup error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
