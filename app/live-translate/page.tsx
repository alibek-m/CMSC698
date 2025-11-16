"use client";

import { useEffect, useRef, useState } from "react";

export default function LiveTranslatePage() {
  const [source, setSource] = useState("");
  const [target, setTarget] = useState("EN");
  const [translated, setTranslated] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  async function requestTranslation(text: string, targetLang: string) {
    if (!text.trim()) {
      setTranslated("");
      setStatus(null);
      return;
    }

    try {
      setIsTranslating(true);
      setStatus(null);

      const res = await fetch("/api/translate-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, target: targetLang }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setStatus(data.error || "Translation failed");
        return;
      }

      setTranslated(data.translated || "");
    } catch (err: any) {
      setStatus(err.message || "Network error");
    } finally {
      setIsTranslating(false);
    }
  }

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      requestTranslation(source, target);
    }, 500); 

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [source, target]);

  return (
    <main style={{ maxWidth: 800, margin: "2rem auto", display: "flex", gap: 16 }}>
      <section style={{ flex: 1 }}>
        <h2>Original</h2>
        <div style={{ marginBottom: 8 }}>
          <label>
            Target language (EN, DE, FR, RU, ...):{" "}
            <input
              value={target}
              onChange={(e) => setTarget(e.target.value.toUpperCase())}
              style={{ width: 80 }}
            />
          </label>
        </div>
        <textarea
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="Type text here..."
          style={{ width: "100%", minHeight: 250, padding: 8 }}
        />
      </section>

      <section style={{ flex: 1 }}>
        <h2>
          Translation{" "}
          {isTranslating && <span style={{ fontSize: 12 }}> (translating…)</span>}
        </h2>
        <textarea
          value={translated}
          readOnly
          style={{ width: "100%", minHeight: 250, padding: 8, background: "#f9f9f9" }}
        />
        {status && <p style={{ marginTop: 8, color: "red" }}>{status}</p>}
      </section>
    </main>
  );
}
