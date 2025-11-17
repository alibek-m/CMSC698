"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type LoginResult = {
  ok: boolean;
  error?: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [res, setRes] = useState<LoginResult | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setRes(null);

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      const r = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await r.json();
      if (!r.ok || !data.ok) {
        setRes({
          ok: false,
          error: data.error || "Wrong password/username",
        });
        return;
      }

      setRes({ ok: true });

      setTimeout(() => {
        router.push("/live-translate"); 
      }, 800);
    } catch (err: any) {
      setRes({ ok: false, error: err.message || "Network error" });
    }
  }

  return (
    <main style={{ maxWidth: 420, margin: "5rem auto", padding: 16 }}>
      <h1 style={{ marginBottom: 8 }}>Log in</h1>
      <form
        onSubmit={onSubmit}
        style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}
      >
        <input
          name="username"
          placeholder="username"
          style={{ display: "block", width: "100%", margin: "6px 0", padding: 8 }}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="password"
          style={{ display: "block", width: "100%", margin: "6px 0", padding: 8 }}
          required
        />
        <button type="submit" style={{ padding: "8px 12px" }}>Log in</button>
        {res && (
          <p
            style={{
              marginTop: 8,
              color: res.ok ? "green" : "crimson",
            }}
          >
            {res.ok
              ? "Success! Redirecting..."
              : res.error || "Wrong password/username"}
          </p>
        )}
      </form>

      <p style={{ marginTop: 10, fontSize: 14 }}>
        Don’t have an account?{" "}
        <Link href="/signup" style={{ textDecoration: "underline" }}>
          Sign up
        </Link>
      </p>
    </main>
  );
}
