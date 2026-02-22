"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import {
  MessageSquare,
  Truck,
  Calendar,
  Newspaper,
  ExternalLink,
  Building2,
  TrendingUp,
  RefreshCw,
  Loader2,
  AlertTriangle,
  Thermometer,
  ShoppingCart,
  Sprout,
  Globe,
  BadgeCheck,
  Clock,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────
interface Article {
  title: string;
  link: string;
  source: string;
  date: string;
  description: string;
}

interface WeatherData {
  temp: string;
  condition: string;
  icon: string;
}

interface AiTip {
  text: string;
}

// ─── Deadline helpers (shared logic, inline here for dashboard) ───
function computeDashboardDeadlines() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const raw: { label: string; isoDate: string }[] = [
    { label: "APIA – Cerere Unică de Plată 2025 (depunere)", isoDate: "2025-05-15" },
    { label: "APIA – Cerere Unică de Plată 2025 (cu penalizare)", isoDate: "2025-06-09" },
    { label: "ANAF – D300 TVA T1 2025", isoDate: "2025-04-25" },
    { label: "ANAF – D300 TVA T2 2025", isoDate: "2025-07-25" },
    { label: "ANAF – D300 TVA T3 2025", isoDate: "2025-10-25" },
    { label: "ANAF – D100 Impozit Micro T1 2025", isoDate: "2025-04-25" },
    { label: "ANAF – D100 Impozit Micro T2 2025", isoDate: "2025-07-25" },
    { label: "ANAF – D100 Impozit Micro T3 2025", isoDate: "2025-10-25" },
    { label: "ANAF – Bilanț Anual 2024", isoDate: "2025-05-31" },
    { label: "ANAF – SAF-T D406 (intrare vigoare)", isoDate: "2026-01-01" },
    { label: "ANAF – D300 TVA T4 2025", isoDate: "2026-01-25" },
    { label: "ANAF – D112 Salarii Ian 2026", isoDate: "2026-02-25" },
    { label: "ANAF – D112 Salarii Feb 2026", isoDate: "2026-03-25" },
    { label: "ANAF – D300 TVA Q1 2026", isoDate: "2026-04-25" },
    { label: "ANAF – D100 Micro Q1 2026", isoDate: "2026-04-25" },
    { label: "ANAF – D112 Salarii Mar 2026", isoDate: "2026-04-25" },
    { label: "APIA – Cerere Unică de Plată 2026", isoDate: "2026-05-15" },
    { label: "ANAF – Bilanț Anual 2025 (depus 2026)", isoDate: "2026-05-31" },
    { label: "AFIR – Verifică sesiunile PNDR active", isoDate: "2025-12-31" },
    { label: "MADR – Înregistrare exploatație (rolling)", isoDate: "2026-12-31" },
  ];

  return raw
    .map(({ label, isoDate }) => {
      const deadline = new Date(isoDate);
      deadline.setHours(0, 0, 0, 0);
      const diffMs = deadline.getTime() - today.getTime();
      const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      const expired = daysLeft < 0;
      let color: "red" | "yellow" | "green" | "gray" = "green";
      if (expired) color = "gray";
      else if (daysLeft <= 7) color = "red";
      else if (daysLeft <= 30) color = "yellow";
      return { label, date: isoDate, daysLeft, expired, color };
    })
    .sort((a, b) => {
      // Critice first, then approaching, then future, expired last
      const priority = (c: typeof a) =>
        c.expired ? 3 : c.daysLeft <= 7 ? 0 : c.daysLeft <= 30 ? 1 : 2;
      return priority(a) - priority(b) || a.daysLeft - b.daysLeft;
    });
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
  return new Date(isoDate).toLocaleDateString("ro-RO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ─── Market prices (hardcoded realistic MVP values) ───────────────
const marketPrices = [
  { name: "Roșii", price: "4–6 lei/kg", icon: "🍅" },
  { name: "Castraveți", price: "3–5 lei/kg", icon: "🥒" },
  { name: "Ardei", price: "5–8 lei/kg", icon: "🫑" },
  { name: "Salată", price: "2–3 lei/buc", icon: "🥬" },
  { name: "Ceapă verde", price: "2–4 lei/leg.", icon: "🧅" },
];

// ─── Weather helper ───────────────────────────────────────────────
function weatherIconFromCode(code: string): string {
  const c = parseInt(code, 10);
  if (c <= 113) return "☀️";
  if (c <= 143) return "🌤️";
  if (c <= 260) return "🌧️";
  if (c <= 296) return "🌦️";
  if (c <= 395) return "❄️";
  return "🌥️";
}

// ─── Main Dashboard ───────────────────────────────────────────────
export default function DashboardPage() {
  // News
  const [articles, setArticles] = useState<Article[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState<string | null>(null);
  const [newsMsg, setNewsMsg] = useState<string | null>(null);

  // Weather
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  // AI Tip
  const [tip, setTip] = useState<AiTip | null>(null);
  const [tipLoading, setTipLoading] = useState(true);

  const deadlines = computeDashboardDeadlines();
  const criticalCount = deadlines.filter((d) => !d.expired && d.daysLeft <= 7).length;
  const upcomingDeadlines = deadlines.filter((d) => !d.expired).slice(0, 5);

  // ── Fetch news ──────────────────────────────────────────────────
  const fetchNews = useCallback(async () => {
    setNewsLoading(true);
    setNewsError(null);
    setNewsMsg(null);
    try {
      const res = await fetch("/api/news");
      const data = await res.json();
      if (!res.ok || data.error) {
        setNewsError(data.error || "Eroare la încărcarea știrilor.");
        setArticles([]);
      } else if (data.noAgricultureNews) {
        setNewsMsg(data.message || "Nu sunt știri disponibile momentan.");
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

  // ── Fetch weather ───────────────────────────────────────────────
  const fetchWeather = useCallback(async () => {
    setWeatherLoading(true);
    try {
      const res = await fetch("https://wttr.in/Carasova?format=j1", {
        signal: AbortSignal.timeout(5000),
      });
      if (!res.ok) throw new Error("weather fetch failed");
      const json = await res.json();
      const current = json?.current_condition?.[0];
      if (current) {
        const code = current.weatherCode || "116";
        setWeather({
          temp: `${current.temp_C}°C`,
          condition:
            current.weatherDesc?.[0]?.value || "—",
          icon: weatherIconFromCode(code),
        });
      }
    } catch {
      setWeather(null);
    } finally {
      setWeatherLoading(false);
    }
  }, []);

  // ── Fetch AI tip ────────────────────────────────────────────────
  const fetchTip = useCallback(async () => {
    // Check session cache first
    const cached = sessionStorage.getItem("granafarm:tip");
    if (cached) {
      try {
        setTip(JSON.parse(cached) as AiTip);
        setTipLoading(false);
        return;
      } catch { /* ignore */ }
    }

    setTipLoading(true);
    try {
      const month = new Date().toLocaleString("ro-RO", { month: "long" });
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent: "ministerul-agriculturii",
          message: `Dă-mi un sfat agricol scurt și relevant pentru luna ${month} pentru un producător de legume în solarii din România. Max 2 propoziții.`,
          history: [],
        }),
      });
      const data = await res.json();
      const tipData: AiTip = { text: data.message || "—" };
      setTip(tipData);
      sessionStorage.setItem("granafarm:tip", JSON.stringify(tipData));
    } catch {
      setTip({ text: "Monitorizați zilnic umiditatea și temperatura în solare pentru culturi sănătoase." });
    } finally {
      setTipLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
    fetchWeather();
    fetchTip();
  }, [fetchNews, fetchWeather, fetchTip]);

  const today = new Date().toLocaleDateString("ro-RO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Bun venit, GRANA FARM SRL — {today}
        </p>
      </div>

      {/* ── Top stat cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Critical deadlines */}
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={20} className="text-red-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
            <p className="text-xs text-red-500 font-semibold">Termene Critice</p>
            <p className="text-xs text-red-400">sub 7 zile</p>
          </div>
        </div>

        {/* News count */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Newspaper size={20} className="text-blue-500" />
          </div>
          <div>
            {newsLoading ? (
              <Loader2 size={20} className="animate-spin text-blue-400" />
            ) : (
              <>
                <p className="text-2xl font-bold text-blue-600">
                  {articles.length > 0 ? articles.length : "—"}
                </p>
                <p className="text-xs text-blue-500 font-semibold">Știri Agricole</p>
                {articles.length > 0 && (
                  <span className="text-xs bg-green-100 text-green-600 px-1.5 py-0.5 rounded-full font-bold">
                    Live
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Weather */}
        <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center flex-shrink-0 text-xl">
            {weatherLoading ? (
              <Thermometer size={20} className="text-sky-400" />
            ) : weather ? (
              weather.icon
            ) : (
              "🌥️"
            )}
          </div>
          <div>
            {weatherLoading ? (
              <Loader2 size={16} className="animate-spin text-sky-400" />
            ) : weather ? (
              <>
                <p className="text-2xl font-bold text-sky-700">{weather.temp}</p>
                <p className="text-xs text-sky-500 font-semibold truncate max-w-28">
                  {weather.condition}
                </p>
                <p className="text-xs text-sky-400">Caraș-Severin</p>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-gray-500">Indisponibil</p>
                <p className="text-xs text-gray-400">Caraș-Severin</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Main grid ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Widget 1: News Feed */}
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
                <RefreshCw
                  size={14}
                  className={newsLoading ? "animate-spin" : ""}
                />
              </button>
              <Link
                href="/stiri"
                className="text-sm text-primary font-semibold hover:underline"
              >
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

          {!newsLoading && newsMsg && (
            <div className="py-8 text-center text-gray-400">
              <p className="text-sm">{newsMsg}</p>
            </div>
          )}

          {!newsLoading && !newsError && !newsMsg && articles.length === 0 && (
            <p className="text-sm text-gray-400 py-6 text-center">
              Nicio știre agricolă disponibilă.
            </p>
          )}

          {!newsLoading && !newsError && articles.length > 0 && (
            <div className="space-y-4">
              {articles.slice(0, 4).map((item, i) => (
                <div
                  key={i}
                  className="pb-4 border-b border-gray-50 last:border-0 last:pb-0"
                >
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

        {/* Widget 2: Termene (top 5 upcoming, sorted critical-first) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Calendar size={20} className="text-primary" />
              Termene Importante
            </h2>
            <Link
              href="/termene"
              className="text-sm text-primary font-semibold hover:underline"
            >
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
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-lg whitespace-nowrap ml-2 ${badgeMap[item.color]}`}
                >
                  {item.daysLeft}z
                </span>
              </div>
            ))}
            {upcomingDeadlines.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">
                Nu există termene iminente.
              </p>
            )}
          </div>
        </div>

        {/* Widget 3: Company Card (enhanced) */}
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
          <div className="space-y-2.5">
            {[
              { label: "CUI", value: "48892842", icon: <BadgeCheck size={14} className="text-gray-400" /> },
              { label: "CAEN", value: "0113 — Legume în solarii", icon: <Sprout size={14} className="text-gray-400" /> },
              { label: "Județ", value: "Caraș-Severin", icon: null },
              { label: "Dată înf.", value: "4 octombrie 2023", icon: <Clock size={14} className="text-gray-400" /> },
              { label: "Reg. Com.", value: "J11/569/2023", icon: null },
            ].map(({ label, value, icon }) => (
              <div
                key={label}
                className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
              >
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  {icon}
                  {label}
                </div>
                <span className="text-sm font-semibold text-gray-900 text-right max-w-52">
                  {value}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <Globe size={14} className="text-gray-400" />
                Website
              </div>
              <a
                href="https://granafarm.ro"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-primary hover:underline"
              >
                granafarm.ro ↗
              </a>
            </div>
          </div>
        </div>

        {/* Widget 4: Prețuri Piață */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <ShoppingCart size={20} className="text-primary" />
              Prețuri Piață
            </h2>
            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
              En-gros
            </span>
          </div>
          <div className="space-y-3">
            {marketPrices.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full">
                  {item.price}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Prețuri orientative piață en-gros •{" "}
            {new Date().toLocaleDateString("ro-RO", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* ── Bottom row: AI Tip + Quick Actions ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Widget 5: AI Tip of the Day */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <Sprout size={18} className="text-green-600" />
            <h2 className="text-base font-bold text-green-800">
              Sfat Agricol al Zilei
            </h2>
            <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-semibold ml-auto">
              AI
            </span>
          </div>
          {tipLoading ? (
            <div className="flex items-center gap-2 text-green-600">
              <Loader2 size={16} className="animate-spin" />
              <span className="text-sm">Se generează sfatul...</span>
            </div>
          ) : tip ? (
            <p className="text-sm text-green-900 leading-relaxed">{tip.text}</p>
          ) : (
            <p className="text-sm text-green-700">
              Monitorizați zilnic temperatura și umiditatea în solarii.
            </p>
          )}
        </div>

        {/* Widget 6: Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-bold text-gray-900 mb-4">
            Acțiuni Rapide
          </h2>
          <div className="grid grid-cols-4 gap-3">
            <Link
              href="/chat"
              className="flex flex-col items-center justify-center gap-1.5 p-3 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors text-center"
            >
              <MessageSquare size={20} />
              <span className="text-xs font-semibold leading-tight">Chat Agent</span>
            </Link>
            <Link
              href="/furnizori"
              className="flex flex-col items-center justify-center gap-1.5 p-3 bg-orange-50 text-orange-600 rounded-xl hover:bg-orange-100 transition-colors text-center"
            >
              <Truck size={20} />
              <span className="text-xs font-semibold leading-tight">Furnizori</span>
            </Link>
            <Link
              href="/termene"
              className="flex flex-col items-center justify-center gap-1.5 p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors text-center"
            >
              <Calendar size={20} />
              <span className="text-xs font-semibold leading-tight">Termene</span>
            </Link>
            <Link
              href="/stiri"
              className="flex flex-col items-center justify-center gap-1.5 p-3 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 transition-colors text-center"
            >
              <Newspaper size={20} />
              <span className="text-xs font-semibold leading-tight">Știri</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
