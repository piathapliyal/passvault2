import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";

const uri = process.env.MONGODB_URI!;
mongoose.connect(uri);


const VaultSchema = new mongoose.Schema({
  userId: String,
  title: String,
  username: String,
  password: String,
  url: String,
  notes: String,
  createdAt: { type: Date, default: Date.now },
});

const Vault =
  mongoose.models.Vault || mongoose.model("Vault", VaultSchema);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Only POST allowed" });

  const { userId, title, username, password, url, notes } = req.body;

  if (!userId || !title || !username || !password)
    return res.status(400).json({ error: "Missing required fields" });

  try {
    const newItem = new Vault({ userId, title, username, password, url, notes });
    await newItem.save();
    return res.status(201).json({ ok: true, id: newItem._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
