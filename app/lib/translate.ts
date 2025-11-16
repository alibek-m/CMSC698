export async function deeplTranslate(text: string, targetLang: string) {
  const key = process.env.DEEPL_API_KEY;
  if (!key) throw new Error("Missing DeepL API key");

  const endpoint = "https://api-free.deepl.com/v2/translate";

  const body = {
    text: [text], 
    target_lang: targetLang.toUpperCase(),
  };

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Authorization": `DeepL-Auth-Key ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`DeepL error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.translations?.[0]?.text ?? "";
}
