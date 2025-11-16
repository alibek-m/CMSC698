import { NextResponse } from "next/server";
import { deeplTranslate } from "@/app/lib/translate";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { text, target } = await req.json();

    if (!text || !text.trim()) {
      return NextResponse.json(
        { ok: false, error: "Missing text" },
        { status: 400 }
      );
    }

    const targetLang = String(target || "EN").toUpperCase();
    const translated = await deeplTranslate(text, targetLang);

    return NextResponse.json({ ok: true, translated });
  } catch (e: any) {
    console.error("translate-text error:", e);
    return NextResponse.json(
      { ok: false, error: e.message || "Translation failed" },
      { status: 500 }
    );
  }
}
