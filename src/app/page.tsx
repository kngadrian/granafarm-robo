"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import {
  MessageSquare,
  Truck,
  Calendar,
  FileText,
  ExternalLink,
  Building2,
  TrendingUp,
  RefreshCw,
  Loader2,
} from "lucide-react";

interface Article {
  title: string;
  link: string;
  source: string;
  date: string;
  description: string;
}

interface DeadlineItem {
  label: string;
  date: string; // ISO date string
  color: "red" | "yellow" | "green" | "gray";
  daysLeft: number;
  expired: boolean;
}

function computeDeadlines(): DeadlineItem[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const raw: { label: string; isoDate: string }[] = [
    // APIA
    { label: "APIA – Cerere Unică de Plată 2025 (depunere)", isoDate: "2025-05-15" },
    { label: "APIA – Cerere Unică de Plată 2025 (cu penalizare)", isoDate: "2025-06-09" },
    // ANAF D300 TVA trimestrial 2025
    { label: "ANAF – D300 TVA T1 2025", isoDate: "2025-04-25" },
    { label: "ANAF – D300 TVA T2 2025", isoDate: "2025-07-25" },
    { label: "ANAF – D300 TVA T3 2025", isoDate: "2025-10-25" },
    // ANAF D100 impozit micro trimestrial 2025
    { label: "ANAF – D100 Impozit Micro T1 2025", isoDate: "2025-04-25" },
    { label: "ANAF – D100 Impozit Micro T2 2025", isoDate: "2025-07-25" },
    { label: "ANAF – D100 Impozit Micro T3 2025", isoDate: "2025-10-25" },
    // ANAF Bilanț anual
    { label: "ANAF – Bilanț Anual 2024 (microîntreprinderi)", isoDate: "2025-05-31" },
    // ANAF D112 salarii 2026
    { label: "ANAF – D112 Salarii Ian 2026", isoDate: "2026-02-25" },
    { label: "ANAF – D112 Salarii Feb 2026", isoDate: "2026-03-25" },
    // ANAF D300 TVA 2026
    { label: "ANAF – D300 TVA T4 2025 / Ian 2026", isoDate: "2026-01-25" },
    { label: "ANAF – D300 TVA T1 2026", isoDate: "2026-04-25" },
    // AFIR sesiuni
    { label: "AFIR – Verifică sesiunile PNDR active pe afir.ro", isoDate: "2025-12-31" },
    // SAF-T D406
    { label: "ANAF – SAF-T D406 (termen de grație 2025 micro)", isoDate: "2025-12-31" },
    // Min. Agriculturii
    { label: "Min. Agriculturii – Înregistrare exploatație (rolling)", isoDate: "2026-12-31" },
  ];

  return raw
    .map(({ label, isoDate }) => {
      const deadline = new Date(isoDate);
      deadline.setHours(0, 0, 0, 0);
      const diffMs = deadline.getTime() - today.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      const expired = diffDays < 0;

      let color: "red" | "yellow" | "green" | "gray" = "green";
      if (expired) color = "gray";
      else if (diffDays <= 7) color = "red";
      else if (diffDays <= 30) color = "yellow";

      return {
        label,
        date: isoDate,
        daysLeft: diffDays,
        expired,
        color,
      };
    })
    .sort((a, b) => a.daysLeft - b.daysLeft);
}

const colorMap = {
  red: "bg-red-50 border-red-200 text-red-700",
  yellow: "bg-yellow-50 border-yellow-200 text-yellow-700",
  green: "bg-green-50 border-green-200 text-green-700",
  gray: "bg-gray-50 border-gray-200 text-gray-500",
};

const badgeMap = {
  red: "bg-red-100 text-red-700",
  yellow: "bg-yellow-100 text-yellow-700",
  green: "bg-green-100 text-green-700",
  gray: "bg-gray-100 text-gray-500",
};

function formatDate(isoDate: string): string {
  const d = new Date(isoDate);
  return d.toLocaleDateString("ro-RO", { day: "2-digit", month: "short", year: "numeric" });
}

export default function DashboardPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState<string | null>(null);
  const deadlines = computeDeadlines();

  const fetchNews = useCallback(async () => {
    setNewsLoading(true);
    setNewsError(null);
    try {
      const res = await fetch("/api/news");
      const data = await res.json();
      if (!res.ok || data.error) {
        setNewsError(data.error || "Eroare la încărcarea știrilor.");
        setArticles([]);
      } else {
        setArticles(data.articles || []);
      }
    } catch {
      setNewsError("Nu s-au putut încărca știrile. Verifică conexiunea.");
      setArticles([]);
    } finally {
      setNewsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Show only items close to expiry (upcoming) or expired in last 30 days
  const upcomingDeadlines = deadlines
    .filter((d) => d.daysLeft > -30 && d.daysLeft <= 90)
    .slice(0, 5);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Bun venit, GRANA FARM SRL — Situație generală</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* News Feed */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp size={20} className="text-primary" />
              Știri Agricole
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchNews}
                disabled={newsLoading}
                className="text-gray-400 hover:text-primary transition-colors disabled:opacity-40"
                title="Reîncarcă"
              >
                <RefreshCw size={14} className={newsLoading ? "animate-spin" : ""} />
              </button>
              <Link href="/stiri" className="text-sm text-primary font-semibold hover:underline">
                Toate →
              </Link>
            </div>
          </div>

          {newsLoading && (
            <div className="flex items-center justify-center py-10 gap-2 text-gray-400">
              <Loader2 size={20} className="animate-spin" />
              <span className="text-sm">Se încarcă știrile...</span>
            </div>
          )}

          {!newsLoading && newsError && (
            <div className="py-6 text-center">
              <p className="text-sm text-gray-500 mb-3">{newsError}</p>
              <button
                onClick={fetchNews}
                className="text-sm text-primary font-semibold hover:underline flex items-center gap-1 mx-auto"
              >
                <RefreshCw size={12} />
                Încearcă din nou
              </button>
            </div>
          )}

          {!newsLoading && !newsError && articles.length === 0 && (
            <p className="text-sm text-gray-400 py-6 text-center">Nicio știre disponibilă.</p>
          )}

          {!newsLoading && !newsError && articles.length > 0 && (
            <div className="space-y-4">
              {articles.slice(0, 4).map((item, i) => (
                <div key={i} className="pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2">
                        {item.link ? (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary transition-colors"
                          >
                            {item.title}
                          </a>
                        ) : (
                          item.title
                        )}
                      </h3>
                      {item.description && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs font-medium text-primary bg-green-50 px-2 py-0.5 rounded-full">
                          {item.source}
                        </span>
                        <span className="text-xs text-gray-400">
                          {item.date
                            ? new Date(item.date).toLocaleDateString("ro-RO", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : ""}
                        </span>
                      </div>
                    </div>
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-primary flex-shrink-0 mt-1 transition-colors"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Termene */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Calendar size={20} className="text-primary" />
              Termene Importante
            </h2>
            <Link href="/termene" className="text-sm text-primary font-semibold hover:underline">
              Toate →
            </Link>
          </div>
          <div className="space-y-3">
            {upcomingDeadlines.map((item, i) => (
              <div
                key={i}
                className={`flex items-center justify-between p-3 rounded-xl border ${colorMap[item.color]}`}
              >
                <div>
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p className="text-xs opacity-75 mt-0.5">{formatDate(item.date)}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-lg whitespace-nowrap ${badgeMap[item.color]}`}>
                  {item.expired ? "Expirat" : `${item.daysLeft}z`}
                </span>
              </div>
            ))}
            {upcomingDeadlines.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">Nu există termene iminente.</p>
            )}
          </div>
        </div>

        {/* Company Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Building2 size={24} className="text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">GRANA FARM SRL</h2>
              <span className="text-xs font-semibold bg-accent/20 text-accent px-2 py-0.5 rounded-full">
                Microîntreprindere
              </span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <span className="text-sm text-gray-500">CUI</span>
              <span className="text-sm font-semibold text-gray-900">48892842</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <span className="text-sm text-gray-500">CAEN</span>
              <span className="text-sm font-semibold text-gray-900">0113</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <span className="text-sm text-gray-500">Activitate</span>
              <span className="text-sm font-semibold text-gray-900 text-right max-w-48">
                Cultivarea legumelor și pepenilor
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <span className="text-sm text-gray-500">Județ</span>
              <span className="text-sm font-semibold text-gray-900">Caraș-Severin</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-500">Website</span>
              <a
                href="https://granafarm.ro"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-primary hover:underline"
              >
                granafarm.ro
              </a>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Acțiuni Rapide</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/chat"
              className="flex flex-col items-center justify-center gap-2 p-4 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
            >
              <MessageSquare size={24} />
              <span className="text-sm font-semibold">Chat AI</span>
            </Link>
            <Link
              href="/furnizori"
              className="flex flex-col items-center justify-center gap-2 p-4 bg-accent/10 text-gray-700 rounded-xl hover:bg-accent/20 transition-colors border border-accent/30"
            >
              <Truck size={24} className="text-accent" />
              <span className="text-sm font-semibold">Furnizori</span>
            </Link>
            <Link
              href="/termene"
              className="flex flex-col items-center justify-center gap-2 p-4 bg-blue-50 text-gray-700 rounded-xl hover:bg-blue-100 transition-colors border border-blue-100"
            >
              <Calendar size={24} className="text-blue-500" />
              <span className="text-sm font-semibold">Termene</span>
            </Link>
            <Link
              href="/chat?agent=contabilitate"
              className="flex flex-col items-center justify-center gap-2 p-4 bg-purple-50 text-gray-700 rounded-xl hover:bg-purple-100 transition-colors border border-purple-100"
            >
              <FileText size={24} className="text-purple-500" />
              <span className="text-sm font-semibold">Raport Contabil</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
