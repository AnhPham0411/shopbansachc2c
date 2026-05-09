import { cookies } from "next/headers";
import { dictionaries } from "./dictionaries";

export async function getLanguage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value || "vi";
  return lang as "vi" | "en";
}

export async function getDictionary() {
  const lang = await getLanguage();
  return dictionaries[lang];
}

export async function t(key: string, replacements?: Record<string, string | number>) {
  const dict = await getDictionary();
  let text = (dict as any)[key] || key;
  if (replacements) {
    Object.entries(replacements).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, String(v));
    });
  }
  return text;
}

export async function translateText(text: string, from: string, to: string) {
  try {
    const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`);
    const data = await res.json();
    return data.responseData.translatedText || text;
  } catch (error) {
    console.error("Translation error:", error);
    return text;
  }
}

export async function translateBooks(books: any[]) {
  const lang = await getLanguage();
  if (lang !== "en" || books.length === 0) return books;

  const chunkSize = 5;
  const translatedBooks = [...books];

  for (let i = 0; i < books.length; i += chunkSize) {
    const chunk = books.slice(i, i + chunkSize);
    const titles = chunk.map(b => b.title).join(" ||| ");
    try {
      const translatedTitlesText = await translateText(titles, "vi", "en");
      const translatedTitles = translatedTitlesText.split(" ||| ");
      
      chunk.forEach((b, j) => {
        const index = i + j;
        translatedBooks[index] = {
          ...translatedBooks[index],
          title: translatedTitles[j]?.trim() || b.title
        };
      });
    } catch (error) {
      console.error("Error translating chunk:", error);
    }
  }

  return translatedBooks;
}
