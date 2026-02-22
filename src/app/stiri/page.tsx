"use client";

import { useState, useEffect, useCallback } from "react";
import { ExternalLink, RefreshCw, Loader2 } from "lucide-react";

interface Article {
  title: string;
  link: string;
  source: string;
  date: string;
  description: string;
  category?: string;
}

const CATEGORY_KEYWORDS: Record<string, RegExp> = {
  APIA: /APIA|cerere unică|plată directă|eco-schemă|subvenții/i,
  ANAF: /ANAF|fiscal|TVA|declarație|impozit|bilanț|SAF-T|D300|D100|D112/i,
  AFIR: /AFIR|PNDR|PNRR|fonduri europene|finanțare/i,
  Piețe: /preț|piețe|en-gros|export|import|comercializare/i,
  Legislație: /lege|norme|regulament|Ministerul Agriculturii|MADR|legislație|monitorul oficial/i,
};

function categorizeArticle(article: Article): string {
  const text = `${article.title} ${article.description} ${article.source}`;
  for (const [cat, regex] of Object.entries(CATEGORY_KEYWORDS)) {
    if (regex.test(text)) return cat;
  }
  return "General";
}

const sourceBadgeColors: Record<string, string> = {
  APIA: "bg-green-100 text-green-700",
  ANAF: "bg-blue-100 text-blue-700",
  AFIR: "bg-indigo-100 text-indigo-700",
  "Min. Agriculturii": "bg-emerald-100 text-emerald-700",
  Agerpres: "bg-gray-100 text-gray-700",
  AgroInteligenta: "bg-lime-100 text-lime-700",
  "Profit.ro": "bg-orange-100 text-orange-700",
};

const categories = ["Toate", "APIA", "ANAF", "AFIR", "Piețe", "Legislație", "General"];

export default function StiriPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("Toate");

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/news");
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Eroare la încărcarea știrilor.");
        setArticles([]);
      } else {
        const tagged: Article[] = (data.articles || []).map((a: Article) => ({
          ...a,
          category: categorizeArticle(a),
        }));
        setArticles(tagged);
      }
    } catch {
      setError("Nu s-au putut încărca știrile. Verifică conexiunea.");
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const filtered =
    activeCategory === "Toate"
      ? articles
      : articles.filter((a) => a.category === activeCategory);

  // Only show categories that have articles
  const availableCategories = categories.filter(
    (cat) => cat === "Toate" || articles.some((a) => a.category === cat)
  );

  return (
    <div className="p-8">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Știri Agricole</h1>
            <p className="text-gray-500 mt-1">Ultimele noutăți pentru GRANA FARM SRL</p>
          </div>
          <button
            onClick={fetchNews}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Actualizează
          </button>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-20 gap-3 text-gray-400">
          <Loader2 size={24} className="animate-spin" />
          <span className="text-base">Se încarcă știrile din sursele agricole...</span>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <p className="text-gray-600 text-base">{error}</p>
          <button
            onClick={fetchNews}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary/90 transition-colors"
          >
            <RefreshCw size={14} />
            Încearcă din nou
          </button>
        </div>
      )}

      {/* Content */}
      {!loading && !error && (
        <>
          {/* Filter tabs */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {availableCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-white shadow-sm"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {cat}
                {cat !== "Toate" && (
                  <span className="ml-1.5 text-xs opacity-60">
                    ({articles.filter((a) => a.category === cat).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p>Nu există știri în această categorie.</p>
            </div>
          )}

          {/* News grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      sourceBadgeColors[item.source] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {item.source}
                  </span>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {item.date
                      ? new Date(item.date).toLocaleDateString("ro-RO", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : ""}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-gray-900 leading-snug mb-2 line-clamp-2">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 flex-1">
                    {item.description}
                  </p>
                )}
                {item.link ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    Citește mai mult
                    <ExternalLink size={12} />
                  </a>
                ) : (
                  <span className="mt-4 text-xs text-gray-300">Fără link direct</span>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
