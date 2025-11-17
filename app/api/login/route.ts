import { NextResponse } from "next/server";
import { validateLogin } from "@/app/lib/data"; 

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { ok: false, error: "Missing username or password" },
        { status: 400 }
      );
    }

    const user = await validateLogin(username, password);
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const res = NextResponse.json({
      ok: true,
      user: { iduser: user.iduser, name: user.name, email: user.email },
    });

    // set userId cookie
    res.cookies.set("userId", user.iduser, {
      httpOnly: true,
      path: "/",                             
      maxAge: 60 * 60 * 24 * 7,              // 7 days
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return res;
  } catch (e: any) {
    console.error("login error:", e);
    return NextResponse.json(
      { ok: false, error: e.message || "Login failed" },
      { status: 500 }
    );
  }
}
