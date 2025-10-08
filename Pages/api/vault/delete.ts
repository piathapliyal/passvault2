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
  createdAt: Date,
});

const Vault =
  mongoose.models.Vault || mongoose.model("Vault", VaultSchema);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Only POST allowed" });

  const { id } = req.body;
  if (!id) return res.status(400).json({ error: "Missing ID" });

  try {
    await Vault.findByIdAndDelete(id);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
