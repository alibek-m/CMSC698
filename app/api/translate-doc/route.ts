import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file") as File;
  const target = String(form.get("target") || "EN");
  const outputFormat = String(form.get("output_format") || "");
  if (!file) return NextResponse.json({ ok:false, error:"No file" }, { status:400 });

  const api = "https://api-free.deepl.com/v2/document";
  const key = process.env.DEEPL_API_KEY!;
  const upload = new FormData();
  upload.append("file", file, file.name);
  upload.append("target_lang", target.toUpperCase());
  if (outputFormat) upload.append("output_format", outputFormat);

  // 1) upload
  const upRes = await fetch(api, {
    method: "POST",
    headers: { Authorization: `DeepL-Auth-Key ${key}` },
    body: upload,
  });
  if (!upRes.ok) return NextResponse.json({ ok:false, error:await upRes.text() }, { status:500 });
  const { document_id, document_key } = await upRes.json();

  // 2) poll
  for (;;) {
    const st = await fetch(`${api}/${document_id}`, {
      headers: { Authorization: `DeepL-Auth-Key ${key}`, "Content-Type":"application/json" },
      method: "POST",
      body: JSON.stringify({ document_key }),
    });
    const j = await st.json();
    if (j.status === "done") break;
    if (j.status === "error") return NextResponse.json({ ok:false, error:j.error_message }, { status:500 });
    await new Promise(r => setTimeout(r, 1500));
  }

  // 3) download
  const res = await fetch(`${api}/${document_id}/result`, {
    headers: { Authorization: `DeepL-Auth-Key ${key}`, "Content-Type":"application/json" },
    method: "POST",
    body: JSON.stringify({ document_key }),
  });
  if (!res.ok) return NextResponse.json({ ok:false, error:await res.text() }, { status:500 });

  // pass through the translated file
  const blob = await res.arrayBuffer();
  return new Response(blob, {
    headers: {
      "Content-Type": res.headers.get("Content-Type") || "application/octet-stream",
      "Content-Disposition": `attachment; filename="translated_${file.name}"`,
    },
  });
}
