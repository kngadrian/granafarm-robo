export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

interface Article {
  title: string;
  link: string;
  source: string;
  date: string;
  description: string;
}

function parseRSS(xml: string, sourceName: string): Article[] {
  const items: Article[] = [];
  const itemMatches = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];
  for (const item of itemMatches.slice(0, 10)) {
    const title =
      item.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/)?.[1] ||
      item.match(/<title>([\s\S]*?)<\/title>/)?.[1] ||
      "";
    const link =
      item.match(/<link>([\s\S]*?)<\/link>/)?.[1] ||
      item.match(/<link\s+href="(.*?)"/)?.[1] ||
      "";
    const description =
      item.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/)?.[1] ||
      item.match(/<description>([\s\S]*?)<\/description>/)?.[1] ||
      "";
    const pubDate =
      item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || new Date().toUTCString();

    if (title.trim()) {
      items.push({
        title: title.trim(),
        link: link.trim(),
        source: sourceName,
        date: pubDate.trim(),
        description: description
          .replace(/<[^>]*>/g, "")
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&nbsp;/g, " ")
          .trim()
          .slice(0, 200),
      });
    }
  }
  return items;
}

// Strict agriculture-only keyword filter
const AGRICULTURE_KEYWORDS =
  /agricol|agricultur[ăa]|ferm[ăa]|fermier|ser[ăa]|solar|legume|fructe|cereale|APIA|AFIR|subven[tț]i[ie]|recolt[ăa]|cultur[ăa]|cultivare|iri[Gg]a[tț]i|în[Gg]r[ăa][sș][ăa]m[âa]nt|pesticide|fitosanitar|PAC|PNDR|MADR|ministerul agriculturii|teren agricol|exploata[tț]ie|zootehnie|animale|lapte|carne|gr[âa]u|porumb|floarea soarelui|soia|cartofi|tomate|castrave[tț]i|ardei/i;

// Agriculture-specific RSS feeds ONLY
const RSS_FEEDS: { url: string; name: string }[] = [
  { url: "https://agrointeligenta.ro/feed/", name: "AgroInteligenta" },
  { url: "https://www.agro-tv.ro/feed/", name: "Agro TV" },
  { url: "https://www.fermierul.ro/feed/", name: "Fermierul.ro" },
  { url: "https://www.profit.ro/rss/domenii/agricultura.xml", name: "Profit.ro Agri" },
  { url: "https://www.agerpres.ro/rss/economie", name: "Agerpres" },
];

async function fetchFeed(url: string, name: string): Promise<Article[]> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "GranaFarm-RoboBot/1.0",
      Accept: "application/rss+xml, application/xml, text/xml",
    },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const xml = await res.text();
  return parseRSS(xml, name);
}

export async function GET() {
  const allArticles: Article[] = [];
  const errors: string[] = [];

  await Promise.allSettled(
    RSS_FEEDS.map(async ({ url, name }) => {
      try {
        const articles = await fetchFeed(url, name);
        allArticles.push(...articles);
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : String(err);
        errors.push(`${name}: ${errMsg}`);
      }
    })
  );

  // Strict agriculture keyword filter — every article must pass
  const filtered = allArticles.filter(
    (a) =>
      AGRICULTURE_KEYWORDS.test(a.title) ||
      AGRICULTURE_KEYWORDS.test(a.description)
  );

  // Fallback: if < 3 articles pass filter, return a "no news" response (no mock data)
  if (filtered.length < 3) {
    if (allArticles.length === 0) {
      // Complete fetch failure
      return NextResponse.json(
        {
          error:
            "Nu am putut încărca știrile. Încearcă din nou mai târziu.",
          details: errors,
          articles: [],
        },
        {
          status: 503,
          headers: { "Cache-Control": "no-cache" },
        }
      );
    }
    // Had articles but none passed the agriculture filter
    return NextResponse.json(
      {
        noAgricultureNews: true,
        message:
          "Nu sunt știri disponibile momentan. Încearcă din nou mai târziu.",
        articles: [],
        errors: errors.length > 0 ? errors : undefined,
      },
      {
        headers: { "Cache-Control": "no-cache" },
      }
    );
  }

  // Sort by date descending
  const sorted = filtered.sort((a, b) => {
    const dateA = new Date(a.date).getTime() || 0;
    const dateB = new Date(b.date).getTime() || 0;
    return dateB - dateA;
  });

  // Deduplicate by title (same article may appear in multiple feeds)
  const seen = new Set<string>();
  const deduped = sorted.filter((a) => {
    const key = a.title.toLowerCase().slice(0, 60);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Max 12
  const result = deduped.slice(0, 12);

  return NextResponse.json(
    { articles: result, errors: errors.length > 0 ? errors : undefined },
    {
      headers: {
        "Cache-Control": "max-age=21600, s-maxage=21600",
      },
    }
  );
}
