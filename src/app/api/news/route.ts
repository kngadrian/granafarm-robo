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
  for (const item of itemMatches.slice(0, 6)) {
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

const AGRICULTURE_KEYWORDS =
  /agricultură|agricol|legume|APIA|ANAF|AFIR|subvenții|subventii|fermier|recoltă|recolta|seră|sera|solar|agrar|cultiv|plantă|plante|vegetale|cereale|ferma|fermă/i;

const RSS_FEEDS: { url: string; name: string }[] = [
  { url: "https://www.agerpres.ro/rss/economie", name: "Agerpres" },
  { url: "https://agrointeligenta.ro/feed/", name: "AgroInteligenta" },
  { url: "https://www.madr.ro/rss.xml", name: "Min. Agriculturii" },
  { url: "https://anaf.ro/rss", name: "ANAF" },
  { url: "https://www.profit.ro/rss/domenii/agricultura.xml", name: "Profit.ro" },
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

  if (allArticles.length === 0) {
    return NextResponse.json(
      {
        error: "Nu am putut încărca știrile. Încearcă din nou mai târziu.",
        details: errors,
        articles: [],
      },
      {
        status: 503,
        headers: { "Cache-Control": "no-cache" },
      }
    );
  }

  // Filter by agriculture keywords
  const filtered = allArticles.filter(
    (a) => AGRICULTURE_KEYWORDS.test(a.title) || AGRICULTURE_KEYWORDS.test(a.description)
  );

  // If keyword filter removes everything, keep all articles (e.g. feeds that are already agriculture-specific)
  const articlesToReturn = filtered.length > 0 ? filtered : allArticles;

  // Sort by date descending
  const sorted = articlesToReturn.sort((a, b) => {
    const dateA = new Date(a.date).getTime() || 0;
    const dateB = new Date(b.date).getTime() || 0;
    return dateB - dateA;
  });

  // Max 12
  const result = sorted.slice(0, 12);

  return NextResponse.json(
    { articles: result, errors: errors.length > 0 ? errors : undefined },
    {
      headers: {
        "Cache-Control": "max-age=21600, s-maxage=21600",
      },
    }
  );
}
