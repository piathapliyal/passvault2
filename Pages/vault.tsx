"use client";

import { useState, useEffect } from "react";
import { encryptText, decryptText } from "../Utility/encryption"; 


type VaultItem = {
  id: string;
  title: string;
  username: string;
  password: string;
  url?: string;
  notes?: string;
  createdAt: string;
};

export default function VaultPage() {
 
  const [vault, setVault] = useState<VaultItem[]>([]);
  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  
  useEffect(() => {
    const data = localStorage.getItem("vaultItems");
    if (data) setVault(JSON.parse(data));
  }, []);


  useEffect(() => {
    localStorage.setItem("vaultItems", JSON.stringify(vault));
  }, [vault]);

  async function handleSave() {
    if (!title.trim() || !username.trim() || !password.trim()) {
      alert("Please fill in title, username, and password.");
      return;
    }

    const encryptedPw = encryptText(password);

    const newItem: VaultItem = {
      id: editingId || Date.now().toString(),
      title,
      username,
      password: encryptedPw,
      url,
      notes,
      createdAt: new Date().toLocaleString(),
    };

    try {
    
      const res = await fetch("/api/vault/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "123", 
          title,
          username,
          password: encryptedPw,
          url,
          notes,
        }),
      });

      if (!res.ok) throw new Error("Server error");

      alert("Saved to vault!");

      if (editingId) {
        setVault((prev) =>
          prev.map((item) => (item.id === editingId ? newItem : item))
        );
        setEditingId(null);
      } else {
        setVault((prev) => [newItem, ...prev]);
      }

     
      setTitle("");
      setUsername("");
      setPassword("");
      setUrl("");
      setNotes("");
    } catch (err) {
      console.error(err);
      alert("Error saving entry");
    }
  }


  function handleDelete(id: string) {
    if (confirm("Delete this entry?")) {
      setVault((prev) => prev.filter((item) => item.id !== id));
    }
  }


  function handleEdit(item: VaultItem) {
    setTitle(item.title);
    setUsername(item.username);
    setPassword(decryptText(item.password));
    setUrl(item.url || "");
    setNotes(item.notes || "");
    setEditingId(item.id);
  }

 
  function handleCopy(pw: string) {
    navigator.clipboard.writeText(decryptText(pw));
    alert("Password copied! (Will auto-clear in 15s)");
    setTimeout(() => navigator.clipboard.writeText(""), 15000);
  }

  return (
    <div
      style={{
        fontFamily: "system-ui",
        maxWidth: "700px",
        margin: "0 auto",
        padding: "40px",
      }}
    >
      <h1>🔒 My Secure Vault</h1>

      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
          marginBottom: "24px",
        }}
      >
        <h2 style={{ marginBottom: "10px" }}>
          {editingId ? "✏️ Edit Entry" : "➕ Add New Entry"}
        </h2>

        <input
          placeholder="Title (e.g., Gmail)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={inputStyle}
        />
        <input
          placeholder="Username / Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={inputStyle}
        />
        <input
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />
        <input
          placeholder="URL (optional)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={inputStyle}
        />
        <textarea
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={inputStyle}
        />

        <button onClick={handleSave} style={buttonStyle}>
          {editingId ? "💾 Update Entry" : "Save Entry"}
        </button>
      </div>

   
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
        }}
      >
        <h2>📋 Saved Entries</h2>
        {vault.length === 0 ? (
          <p style={{ color: "#666" }}>No saved passwords yet.</p>
        ) : (
          vault.map((item) => (
            <div key={item.id} style={itemBoxStyle}>
              <div>
                <strong>{item.title}</strong>
                <div style={{ color: "#555" }}>{item.username}</div>
                <small style={{ color: "#999" }}>{item.url}</small>
              </div>
              <div>
                <button onClick={() => handleCopy(item.password)} style={copyBtn}>
                  Copy
                </button>
                <button onClick={() => handleEdit(item)} style={editBtn}>
                  Edit
                </button>
                <button onClick={() => handleDelete(item.id)} style={deleteBtn}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


const inputStyle = {
  width: "100%",
  marginBottom: "8px",
  padding: "8px",
  border: "1px solid #ccc",
  borderRadius: "6px",
};

const buttonStyle = {
  width: "100%",
  padding: "10px",
  background: "#111827",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const itemBoxStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  border: "1px solid #eee",
  padding: "10px",
  borderRadius: "8px",
  marginBottom: "8px",
};

const copyBtn = {
  marginRight: "6px",
  background: "#2563eb",
  border: "none",
  color: "white",
  borderRadius: "6px",
  padding: "6px 10px",
  cursor: "pointer",
};

const editBtn = {
  marginRight: "6px",
  background: "#16a34a",
  border: "none",
  color: "white",
  borderRadius: "6px",
  padding: "6px 10px",
  cursor: "pointer",
};

const deleteBtn = {
  background: "crimson",
  border: "none",
  color: "white",
  borderRadius: "6px",
  padding: "6px 10px",
  cursor: "pointer",
};
