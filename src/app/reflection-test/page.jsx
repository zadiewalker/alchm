"use client";
import { useState } from "react";

export default function ReflectionTest() {
  const [reflection, setReflection] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/reflection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reflection, email }),
    });
    const data = await res.json();
    setMessage(data.success ? "Saved!" : "Error submitting reflection.");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Test Reflection Submission</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ display: "block", marginBottom: "1rem" }}
        />
        <textarea
          placeholder="Enter reflection..."
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          required
          rows={4}
          style={{ display: "block", width: "100%", marginBottom: "1rem" }}
        />
        <button type="submit">Submit</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
