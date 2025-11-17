import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { saveTranslation } from "@/app/lib/data";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json(
        { ok: false, error: "Not logged in" },
        { status: 401 }
      );
    }

    const { source, translated, sourceLang, targetLang } = await req.json();

    if (!source || !translated || !targetLang) {
      return NextResponse.json(
        { ok: false, error: "Missing fields" },
        { status: 400 }
      );
    }

    await saveTranslation(
      userId,
      String(source),
      String(translated),
      sourceLang ? String(sourceLang) : null,
      String(targetLang).toUpperCase()
    );

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("save-translation error:", e);
    return NextResponse.json(
      { ok: false, error: e.message || "Save failed" },
      { status: 500 }
    );
  }
}
