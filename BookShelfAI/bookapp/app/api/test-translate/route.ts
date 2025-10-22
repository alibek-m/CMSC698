import { deeplTranslate } from "@/app/lib/translate";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const translated = await deeplTranslate("Hello world", "ES");
    return NextResponse.json({ translated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
