"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, MapPin, Globe, RefreshCw, Loader2, Sparkles } from "lucide-react";

interface Supplier {
  id: string;
  name: string;
  category: string;
  location: string;
  products: string;
  website: string | null;
  relevance: string;
}

interface SuppliersData {
  suppliers: Supplier[];
  generatedAt: string;
}

const ALL_CATEGORIES = "Toate";

const categoryColors: Record<string, string> = {
  Seminte: "bg-green-100 text-green-700",
  Ingrasaminte: "bg-yellow-100 text-yellow-700",
  Irigatii: "bg-blue-100 text-blue-700",
  "Folii/Sere": "bg-purple-100 text-purple-700",
  Pesticide: "bg-red-100 text-red-700",
  Utilaje: "bg-orange-100 text-orange-700",
  Transport: "bg-cyan-100 text-cyan-700",
  Altele: "bg-gray-100 text-gray-700",
  // Also handle accented versions in case AI returns them
  "Semințe": "bg-green-100 text-green-700",
  "Îngrășăminte": "bg-yellow-100 text-yellow-700",
  "Irigații": "bg-blue-100 text-blue-700",
};

function getCategoryColor(cat: string): string {
  return categoryColors[cat] || "bg-gray-100 text-gray-700";
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("ro-RO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function FurnizoriPage() {
  const [data, setData] = useState<SuppliersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES);

  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/suppliers");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: SuppliersData = await res.json();
      setData(json);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(`Nu am putut încărca furnizorii: ${msg}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetch("/api/suppliers/refresh", { method: "POST" });
      await fetchSuppliers();
    } catch {
      // ignore
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const suppliers = data?.suppliers || [];

  // Unique categories from fetched data
  const categories = [
    ALL_CATEGORIES,
    ...Array.from(new Set(suppliers.map((s) => s.category))).sort(),
  ];

  const filtered = suppliers.filter((s) => {
    const matchCat =
      activeCategory === ALL_CATEGORIES || s.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.products.toLowerCase().includes(q) ||
      s.location.toLowerCase().includes(q) ||
      (s.relevance || "").toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Furnizori Agricoli</h1>
          <p className="text-gray-500 mt-1">
            Furnizori pentru GRANA FARM SRL — CAEN 0113 (Legume în solarii)
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading || refreshing}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw
            size={14}
            className={refreshing || loading ? "animate-spin" : ""}
          />
          Actualizează lista
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-400">
          <Loader2 size={36} className="animate-spin text-primary" />
          <div className="text-center">
            <p className="text-base font-semibold text-gray-600">
              Se caută cei mai buni furnizori pentru CAEN 0113...
            </p>
            <p className="text-sm mt-1">
              Motorul AI analizează piața agricolă din România
            </p>
          </div>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-3">{error}</p>
          <button
            onClick={fetchSuppliers}
            className="text-sm text-primary font-semibold hover:underline"
          >
            Încearcă din nou
          </button>
        </div>
      )}

      {/* Data loaded */}
      {!loading && !error && data && (
        <>
          {/* AI badge + timestamp */}
          <div className="flex items-center gap-2 mb-5 text-xs text-gray-500">
            <Sparkles size={13} className="text-primary" />
            <span>
              Lista generată de AI + verificată pe internet
            </span>
            <span className="text-gray-300">•</span>
            <span>
              Actualizată la:{" "}
              <span className="font-semibold">
                {data.generatedAt ? formatDate(data.generatedAt) : "Acum"}
              </span>
            </span>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Caută furnizor, produs, locație..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm"
            />
          </div>

          {/* Category filters */}
          <div className="flex gap-2 mb-5 flex-wrap">
            {categories.map((cat) => (
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
              </button>
            ))}
          </div>

          {/* Results count */}
          <p className="text-sm text-gray-500 mb-4">
            {filtered.length} furnizori găsiți
            {suppliers.length !== filtered.length &&
              ` din ${suppliers.length} total`}
          </p>

          {/* Supplier grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((supplier) => (
              <div
                key={supplier.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="flex items-start justify-between mb-3">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getCategoryColor(supplier.category)}`}
                  >
                    {supplier.category}
                  </span>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">
                  {supplier.name}
                </h3>
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                  <MapPin size={12} />
                  {supplier.location}
                </div>
                <p className="text-xs text-gray-600 leading-relaxed mb-2">
                  <span className="font-semibold">Produse: </span>
                  {supplier.products}
                </p>
                {supplier.relevance && (
                  <p className="text-xs text-gray-400 leading-relaxed flex-1 mb-4 italic">
                    {supplier.relevance}
                  </p>
                )}
                <div className="flex items-center justify-between mt-auto">
                  {supplier.website ? (
                    <a
                      href={
                        supplier.website.startsWith("http")
                          ? supplier.website
                          : `https://${supplier.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <Globe size={11} />
                      {supplier.website.replace(/^https?:\/\//, "")}
                    </a>
                  ) : (
                    <span />
                  )}
                  <button className="bg-primary text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors">
                    Contactează
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg font-semibold">Niciun furnizor găsit</p>
              <p className="text-sm mt-1">
                Încearcă altă căutare sau categorie
              </p>
            </div>
          )}

          {suppliers.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg font-semibold">
                Nu au fost găsiți furnizori
              </p>
              <p className="text-sm mt-1 mb-4">
                Apasă &quot;Actualizează lista&quot; pentru a genera o listă nouă
              </p>
              <button
                onClick={handleRefresh}
                className="bg-primary text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-primary/90 transition-colors"
              >
                Generează lista
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
