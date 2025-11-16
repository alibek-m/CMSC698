"use client";

import { useState } from "react";

export default function TranslateDocPage() {
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/translate-doc", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        let msg = `Error: ${res.status}`;
        try {
          const data = await res.json();
          if (data?.error) msg = data.error;
        } catch {}
        setStatus(msg);
        setIsLoading(false);
        return;
      }

      const blob = await res.blob();
      const file = (e.currentTarget.file as HTMLInputElement).files?.[0];
      const filename = file?.name || "translated";

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `translated_${filename}`;
      a.click();
      URL.revokeObjectURL(url);

      setStatus("✅ Translated file downloaded");
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 520, margin: "2rem auto" }}>
      <h1>Translate Document</h1>

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        style={{ border: "1px solid #ddd", padding: 12 }}
      >
        <div style={{ marginBottom: 12 }}>
          <label>
            Select file (.pdf / .docx):
            <input type="file" name="file" accept=".pdf,.docx" required />
          </label>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>
            Target language (EN, DE, FR…):
            <input type="text" name="target" defaultValue="EN" required />
          </label>
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Translating…" : "Translate"}
        </button>
      </form>

      {status && <p style={{ marginTop: 10 }}>{status}</p>}
    </main>
  );
}
