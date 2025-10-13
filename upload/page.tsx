"use client";

import { useState } from "react";

export default function UploadPage() {
  const [msg, setMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg("");

    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();

    setMsg(data.success ? `✅ ${data.message}` : `❌ ${data.error}`);
  }

  return (
    <main style={{ maxWidth: 520, margin: "2rem auto" }}>
      <h1>Upload File</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="file" name="file" required />
        <button type="submit" style={{ marginLeft: 10 }}>Upload</button>
      </form>
      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
    </main>
  );
}
