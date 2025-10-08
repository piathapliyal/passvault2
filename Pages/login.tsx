"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Invalid credentials");
      } else {
        setMessage("Login successful!");
        localStorage.setItem("token", data.token);
      }
    } catch (err) {
      console.error(err);
      setMessage("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "system-ui",
        maxWidth: "400px",
        margin: "auto",
      }}
    >
      <h1>🔐 Login</h1>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "10px" }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              marginTop: "4px",
            }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              marginTop: "4px",
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
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {message && (
        <p
          style={{
            marginTop: "20px",
            color: message.startsWith("✅") ? "green" : "red",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}
