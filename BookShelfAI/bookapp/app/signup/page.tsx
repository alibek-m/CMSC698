"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signupAction } from "@/app/components/actions";

export default function SignUpPage() {
  const [res, setRes] = useState<any>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const r = await signupAction(null as any, fd);
    setRes(r);
    if (r.ok) {
      router.push("/");
    }
  }

  // UI suggested by AI
  return (
    <main style={{ maxWidth: 420, margin: "5rem auto", padding: 16 }}>
      <h1 style={{ marginBottom: 8 }}>Sign up</h1>
      <form onSubmit={onSubmit} style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
        <input
          name="username"
          placeholder="username"
          style={{ display: "block", width: "100%", margin: "6px 0", padding: 8 }}
          required
        />
        <input
          name="email"
          placeholder="email (optional)"
          style={{ display: "block", width: "100%", margin: "6px 0", padding: 8 }}
        />
        <input
          type="password"
          name="password"
          placeholder="password"
          style={{ display: "block", width: "100%", margin: "6px 0", padding: 8 }}
          required
        />
        <button type="submit" style={{ padding: "8px 12px" }}>Create account</button>
        {res && <p style={{ marginTop: 8, color: res.ok ? "green" : "crimson" }}>
          {res.ok ? "Account created! Redirecting to login..." : res.error}
        </p>}
      </form>

      <p style={{ marginTop: 10, fontSize: 14 }}>
        Already have an account?{" "}
        <Link href="/" style={{ textDecoration: "underline" }}>Back to login</Link>
      </p>
    </main>
  );
}
