"use server";

import { signupUser, validateLogin } from "@/app/lib/data";

export async function signupAction(_: any, formData: FormData) {
  try {
    const username = String(formData.get("username") || "");
    const password = String(formData.get("password") || "");
    const email = String(formData.get("email") || "") || undefined;

    const user = await signupUser(username, password, email);
    return { ok: true, user };
  } catch (e: any) {
    return { ok: false, error: e.message || "Signup failed" };
  }
}

export async function loginAction(_: any, formData: FormData) {
  const username = String(formData.get("username") || "");
  const password = String(formData.get("password") || "");
  const user = await validateLogin(username, password);
  if (!user) return { ok: false, error: "Wrong password/username" };
  return { ok: true, user };
}
