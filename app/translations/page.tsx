// app/translations/page.tsx
import { cookies } from "next/headers";
import { getTranslationsForUser } from "@/app/lib/data"; // where you added save/get helpers

export const runtime = "nodejs";

export default async function TranslationsPage() {
  const cookieStore = cookies();
  const userId = cookieStore.get("userId")?.value || null;

  if (!userId) {
    return (
      <main style={{ maxWidth: 600, margin: "2rem auto" }}>
        <h1>Your Saved Translations</h1>
        <p>You need to be logged in to view your saved translations.</p>
        <p style={{ marginTop: 8 }}>
          Go to <a href="/login" style={{ textDecoration: "underline" }}>Login</a>, then come back.
        </p>
      </main>
    );
  }

  const rows = await getTranslationsForUser(userId);

  return (
    <main style={{ maxWidth: 800, margin: "2rem auto" }}>
      <h1>Your Saved Translations</h1>
      {rows.length === 0 ? (
        <p>No translations saved yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {rows.map((row) => (
            <li
              key={row.id}
              style={{
                border: "1px solid #ddd",
                padding: 10,
                marginBottom: 8,
              }}
            >
              <div style={{ fontSize: 12, color: "#555" }}>
                {new Date(row.created_at).toLocaleString()} —{" "}
                <strong>{row.target_lang}</strong>
              </div>

              <div style={{ marginTop: 4 }}>
                <strong>Source:</strong>
                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    background: "#f7f7f7",
                    padding: 6,
                  }}
                >
                  {row.source_text}
                </pre>
              </div>

              <div style={{ marginTop: 4 }}>
                <strong>Translation:</strong>
                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    background: "#f7f7f7",
                    padding: 6,
                  }}
                >
                  {row.translated_text}
                </pre>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
