/**
 * Food photos come from Wikipedia page summaries (images hosted on Wikimedia Commons).
 * The REST endpoint allows cross-origin requests, so no backend or API key is needed.
 */
export interface WikiImage {
  src: string;
  pageUrl: string;
}

const CACHE_KEY = "makanmana:wiki-images:v1";
const memory = new Map<string, Promise<WikiImage | null>>();

function readCache(): Record<string, WikiImage | null> {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function writeCache(title: string, value: WikiImage | null) {
  try {
    const cache = readCache();
    cache[title] = value;
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // storage full or blocked: the in-memory cache still works
  }
}

async function fetchImage(title: string): Promise<WikiImage | null> {
  const cached = readCache();
  if (title in cached) return cached[title];

  try {
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
    if (!res.ok) {
      writeCache(title, null);
      return null;
    }
    const json = await res.json();
    const thumb: string | undefined = json?.thumbnail?.source;
    if (!thumb) {
      writeCache(title, null);
      return null;
    }
    // Ask Wikimedia for a sharper thumbnail than the default 320px.
    const src = thumb.replace(/\/(\d+)px-/, "/640px-");
    const value: WikiImage = {
      src,
      pageUrl: json?.content_urls?.desktop?.page ?? `https://en.wikipedia.org/wiki/${title}`,
    };
    writeCache(title, value);
    return value;
  } catch {
    // offline or blocked: don't cache, try again next time
    return null;
  }
}

export function getWikiImage(title: string): Promise<WikiImage | null> {
  let pending = memory.get(title);
  if (!pending) {
    pending = fetchImage(title);
    memory.set(title, pending);
  }
  return pending;
}
