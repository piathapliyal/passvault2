// pages/signup.tsx
"use client";

import { useState } from "react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Something went wrong!");
      } else {
        setMessage("✅ Signup successful! You can now log in.");
        localStorage.setItem("pbkdf2Salt", data.pbkdf2Salt);
      }
    } catch (err) {
      setMessage("❌ Network or server error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "40px", fontFamily: "system-ui", maxWidth: "400px", margin: "0 auto" }}>
      <h1>🔐 Create Account</h1>
      <form onSubmit={handleSignup}>
        <div style={{ marginBottom: "10px" }}>
          <label>Email:</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "4px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Password:</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "4px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#111827",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      {message && (
        <p style={{ marginTop: "20px", color: message.startsWith("✅") ? "green" : "red" }}>
          {message}
        </p>
      )}
    </div>
  );
}
