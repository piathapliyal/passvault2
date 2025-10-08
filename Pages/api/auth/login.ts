import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("Missing MONGODB_URI in .env.local");
mongoose.connect(uri);


const UserSchema = new mongoose.Schema({
  email: String,
  passwordHash: String,
  pbkdf2Salt: String,
});
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Only POST method allowed" });

  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: "Invalid password" });

   
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    return res.status(200).json({ ok: true, token });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
