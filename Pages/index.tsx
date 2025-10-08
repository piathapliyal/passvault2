// pages/index.tsx
"use client";
import { useState, useEffect } from "react";
import { generatePassword, Options } from "../Utility/generator";

type VaultItem = {
  id: string;
  title: string;
  password: string;
  createdAt: string;
};

export default function Home() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [lower, setLower] = useState(true);
  const [upper, setUpper] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(true);
  const [copied, setCopied] = useState(false);
  const [timer, setTimer] = useState(0);

  const [title, setTitle] = useState("");
  const [vault, setVault] = useState<VaultItem[]>([]);

  // 🧠 Load saved vault items on page load
  useEffect(() => {
    const data = localStorage.getItem("vault");
    if (data) setVault(JSON.parse(data));
  }, []);

  // 💾 Save vault items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("vault", JSON.stringify(vault));
  }, [vault]);

  // 🔐 Generate password
  function handleGenerate() {
    const options: Options = { length, lower, upper, numbers, symbols, excludeAmbiguous };
    const pw = generatePassword(options);
    setPassword(pw);
    setCopied(false);
  }

  // 📋 Copy password to clipboard
  async function handleCopy() {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimer(15);
  }

  // 🧹 Auto-clear clipboard after 15s
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(async () => {
      setTimer(prev => {
        if (prev <= 1) {
          navigator.clipboard.writeText("");
          setCopied(false);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // 💾 Save password to vault
  function handleSave() {
    if (!title.trim()) {
      alert("Please enter a title (like Instagram, Gmail, etc.)");
      return;
    }
    if (!password) {
      alert("Please generate a password first");
      return;
    }

    const newItem: VaultItem = {
      id: Date.now().toString(),
      title,
      password,
      createdAt: new Date().toLocaleString(),
    };

    setVault([newItem, ...vault]);
    setTitle("");
    setPassword("");
  }

  // ❌ Delete vault item
  function handleDelete(id: string) {
    const confirmed = confirm("Delete this saved password?");
    if (!confirmed) return;
    setVault(vault.filter(v => v.id !== id));
  }

  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "system-ui, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ fontSize: "1.8rem", fontWeight: "600", marginBottom: "1rem" }}>
        🔐 Password Generator + Local Vault
      </h1>

      {/* Password generator box */}
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
          marginBottom: "24px",
        }}
      >
        <input
          type="text"
          placeholder="Enter title (e.g., Gmail, Netflix)"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{
            width: "100%",
            marginBottom: "10px",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
          <input
            type="text"
            value={password}
            readOnly
            placeholder="Generated password will appear here"
            style={{
              flex: 1,
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              fontFamily: "monospace",
            }}
          />
          <button
            onClick={handleCopy}
            disabled={!password}
            style={{
              marginLeft: "10px",
              padding: "10px 16px",
              borderRadius: "8px",
              border: "none",
              background: copied ? "#16a34a" : "#2563eb",
              color: "#fff",
              cursor: password ? "pointer" : "not-allowed",
            }}
          >
            {copied ? `Copied (${timer}s)` : "Copy"}
          </button>
        </div>

        {/* Options */}
        <div style={{ marginBottom: "10px" }}>
          <label>Length: {length}</label>
          <input
            type="range"
            min={8}
            max={64}
            value={length}
            onChange={e => setLength(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          <label>
            <input type="checkbox" checked={lower} onChange={() => setLower(!lower)} /> Lowercase
          </label>
          <label>
            <input type="checkbox" checked={upper} onChange={() => setUpper(!upper)} /> Uppercase
          </label>
          <label>
            <input type="checkbox" checked={numbers} onChange={() => setNumbers(!numbers)} /> Numbers
          </label>
          <label>
            <input type="checkbox" checked={symbols} onChange={() => setSymbols(!symbols)} /> Symbols
          </label>
          <label style={{ gridColumn: "span 2" }}>
            <input
              type="checkbox"
              checked={excludeAmbiguous}
              onChange={() => setExcludeAmbiguous(!excludeAmbiguous)}
            />{" "}
            Exclude look-alikes (I, l, 0, O)
          </label>
        </div>

        <button
          onClick={handleGenerate}
          style={{
            width: "100%",
            marginTop: "12px",
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            background: "#111827",
            color: "white",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          Generate Password
        </button>

        <button
          onClick={handleSave}
          style={{
            width: "100%",
            marginTop: "10px",
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            background: "#16a34a",
            color: "white",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          Save to Vault
        </button>
      </div>

      {/* Vault section */}
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
        }}
      >
        <h2 style={{ marginBottom: "10px" }}>🔒 Saved Passwords</h2>
        {vault.length === 0 ? (
          <p style={{ color: "#666" }}>No saved passwords yet.</p>
        ) : (
          vault.map(item => (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: "1px solid #eee",
                padding: "10px",
                borderRadius: "8px",
                marginBottom: "8px",
              }}
            >
              <div>
                <strong>{item.title}</strong>
                <div
                  style={{
                    fontFamily: "monospace",
                    color: "#555",
                    fontSize: "0.9rem",
                    marginTop: "4px",
                  }}
                >
                  {item.password}
                </div>
                <small style={{ color: "#999" }}>Saved: {item.createdAt}</small>
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                style={{
                  border: "none",
                  background: "crimson",
                  color: "white",
                  borderRadius: "8px",
                  padding: "6px 10px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
