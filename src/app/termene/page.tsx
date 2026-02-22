"use client";

import { useState, useMemo } from "react";
import { Calendar, AlertTriangle, CheckCircle, Clock, XCircle, Eye, EyeOff } from "lucide-react";

interface Termen {
  autoritate: string;
  obligatie: string;
  isoDate: string; // YYYY-MM-DD
  categorie: string;
  note?: string;
}

// Real 2025-2026 Romanian agricultural deadlines
const termeneRaw: Termen[] = [
  // ─── ANAF 2025 ─────────────────────────────────────────────────
  {
    autoritate: "ANAF",
    obligatie: "D300 – Decont TVA T4 2024",
    isoDate: "2025-01-25",
    categorie: "ANAF",
  },
  {
    autoritate: "ANAF",
    obligatie: "D100 – Impozit Microîntreprindere T4 2024",
    isoDate: "2025-01-25",
    categorie: "ANAF",
  },
  {
    autoritate: "ANAF",
    obligatie: "D112 – Obligații salariale Decembrie 2024",
    isoDate: "2025-01-25",
    categorie: "ANAF",
  },
  {
    autoritate: "ANAF",
    obligatie: "D300 – Decont TVA T1 2025",
    isoDate: "2025-04-25",
    categorie: "ANAF",
  },
  {
    autoritate: "ANAF",
    obligatie: "D100 – Impozit Microîntreprindere T1 2025",
    isoDate: "2025-04-25",
    categorie: "ANAF",
  },
  {
    autoritate: "ANAF",
    obligatie: "D112 – Obligații salariale Martie 2025",
    isoDate: "2025-04-25",
    categorie: "ANAF",
  },
  {
    autoritate: "ANAF",
    obligatie: "Bilanț Anual 2024 – microîntreprinderi",
    isoDate: "2025-05-31",
    categorie: "ANAF",
  },
  {
    autoritate: "ANAF",
    obligatie: "D300 – Decont TVA T2 2025",
    isoDate: "2025-07-25",
    categorie: "ANAF",
  },
  {
    autoritate: "ANAF",
    obligatie: "D100 – Impozit Microîntreprindere T2 2025",
    isoDate: "2025-07-25",
    categorie: "ANAF",
  },
  {
    autoritate: "ANAF",
    obligatie: "D112 – Obligații salariale Iunie 2025",
    isoDate: "2025-07-25",
    categorie: "ANAF",
  },
  {
    autoritate: "ANAF",
    obligatie: "D300 – Decont TVA T3 2025",
    isoDate: "2025-10-25",
    categorie: "ANAF",
  },
  {
    autoritate: "ANAF",
    obligatie: "D100 – Impozit Microîntreprindere T3 2025",
    isoDate: "2025-10-25",
    categorie: "ANAF",
  },
  {
    autoritate: "ANAF",
    obligatie: "D112 – Obligații salariale Septembrie 2025",
    isoDate: "2025-10-25",
    categorie: "ANAF",
  },
  {
    autoritate: "ANAF",
    obligatie: "SAF-T D406 – Microîntreprinderi (termen de grație 2025)",
    isoDate: "2025-12-31",
    categorie: "ANAF",
    note: "Verifică pe anaf.ro termenul exact; microîntreprinderile au termen de grație în 2025.",
  },
  // ─── ANAF 2026 ─────────────────────────────────────────────────
  {
    autoritate: "ANAF",
    obligatie: "SAF-T D406 – Microîntreprinderi (intrare în vigoare)",
    isoDate: "2026-01-01",
    categorie: "ANAF",
    note: "De la 1 ianuarie 2026 microîntreprinderile depun obligatoriu SAF-T D406.",
  },
  {
    autoritate: "ANAF",
    obligatie: "D300 – Decont TVA T4 2025",
    isoDate: "2026-01-25",
    categorie: "ANAF",
  },
  {
    autoritate: "ANAF",
    obligatie: "D100 – Impozit Microîntreprindere T4 2025",
    isoDate: "2026-01-25",
    categorie: "ANAF",
  },
  {
    autoritate: "ANAF",
    obligatie: "D112 – Salarii Ianuarie 2026",
    isoDate: "2026-02-25",
    categorie: "ANAF",
  },
  {
    autoritate: "ANAF",
    obligatie: "D112 – Salarii Februarie 2026",
    isoDate: "2026-03-25",
    categorie: "ANAF",
  },
  {
    autoritate: "ANAF",
    obligatie: "D300 TVA trimestrial Q1 2026",
    isoDate: "2026-04-25",
    categorie: "ANAF",
  },
  {
    autoritate: "ANAF",
    obligatie: "D100 – Impozit Micro Q1 2026",
    isoDate: "2026-04-25",
    categorie: "ANAF",
  },
  {
    autoritate: "ANAF",
    obligatie: "D112 – Salarii Martie 2026",
    isoDate: "2026-04-25",
    categorie: "ANAF",
  },
  {
    autoritate: "ANAF",
    obligatie: "Bilanț Anual 2025 (depus în 2026)",
    isoDate: "2026-05-31",
    categorie: "ANAF",
    note: "Termen de depunere bilanț anual pentru microîntreprinderi cu exercițiu financiar 2025.",
  },
  // ─── APIA ──────────────────────────────────────────────────────
  {
    autoritate: "APIA",
    obligatie: "Cerere Unică de Plată 2025 – Depunere",
    isoDate: "2025-05-15",
    categorie: "APIA",
    note: "Termen standard de depunere a cererii unice de plată campania 2025.",
  },
  {
    autoritate: "APIA",
    obligatie: "Cerere Unică de Plată 2025 – Cu penalizare (1% / zi)",
    isoDate: "2025-06-09",
    categorie: "APIA",
    note: "Depunere tardivă cu penalizare de 1% pe zi de întârziere.",
  },
  {
    autoritate: "APIA",
    obligatie: "Modificare Cerere Unică de Plată 2025",
    isoDate: "2025-05-31",
    categorie: "APIA",
    note: "Termen orientativ pentru modificări fără penalizare.",
  },
  {
    autoritate: "APIA",
    obligatie: "Cerere Unică de Plată 2026 – Depunere",
    isoDate: "2026-05-15",
    categorie: "APIA",
    note: "Termen standard de depunere a cererii unice de plată campania 2026.",
  },
  // ─── AFIR ──────────────────────────────────────────────────────
  {
    autoritate: "AFIR",
    obligatie: "Sesiuni PNDR active – verifică pe afir.ro",
    isoDate: "2025-12-31",
    categorie: "AFIR",
    note: "Sesiunile PNDR variază; accesează afir.ro pentru sesiunile deschise în 2025.",
  },
  {
    autoritate: "AFIR",
    obligatie: "PNRR – Raportare progres proiecte",
    isoDate: "2025-06-30",
    categorie: "AFIR",
    note: "Termen orientativ raportare intermediară proiecte PNRR.",
  },
  {
    autoritate: "AFIR",
    obligatie: "Monitorizare proiecte active 2026 (rolling)",
    isoDate: "2026-12-31",
    categorie: "AFIR",
    note: "Monitorizare continuă a proiectelor active AFIR pe tot parcursul anului 2026.",
  },
  // ─── MADR / Min. Agriculturii ─────────────────────────────────
  {
    autoritate: "MADR",
    obligatie: "Înregistrare Exploatație Agricolă – permanent (rolling)",
    isoDate: "2026-12-31",
    categorie: "MADR",
    note: "Obligație permanentă — înregistrarea se poate face oricând la DADR județeană.",
  },
  {
    autoritate: "MADR",
    obligatie: "Notificare utilizare produse fitosanitare 2025",
    isoDate: "2025-03-31",
    categorie: "MADR",
  },
];

type StatusType = "Critic" | "Apropiat" | "Viitor" | "Expirat";

interface ComputedTermen extends Termen {
  dataLimita: string;
  status: StatusType;
  zileRamase: number;
}

// Sort priority map: lower = first in list
const sortPriority: Record<StatusType, number> = {
  Critic: 0,
  Apropiat: 1,
  Viitor: 2,
  Expirat: 3,
};

function computeTermene(): ComputedTermen[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return termeneRaw
    .map((t) => {
      const deadline = new Date(t.isoDate);
      deadline.setHours(0, 0, 0, 0);
      const diffMs = deadline.getTime() - today.getTime();
      const zileRamase = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      let status: StatusType;
      if (zileRamase < 0) {
        status = "Expirat";
      } else if (zileRamase <= 7) {
        status = "Critic";
      } else if (zileRamase <= 30) {
        status = "Apropiat";
      } else {
        status = "Viitor";
      }

      const d = new Date(t.isoDate);
      const dataLimita = d.toLocaleDateString("ro-RO", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      return { ...t, dataLimita, status, zileRamase };
    })
    .sort((a, b) => {
      // Primary sort: by status priority
      const prioDiff = sortPriority[a.status] - sortPriority[b.status];
      if (prioDiff !== 0) return prioDiff;
      // Secondary sort: within each group, sort by days left ascending
      return a.zileRamase - b.zileRamase;
    });
}

const categories = ["Toate", "ANAF", "APIA", "AFIR", "MADR"];

const statusConfig: Record<
  StatusType,
  { icon: React.ElementType; className: string; badge: string; row: string; label: string }
> = {
  Critic: {
    icon: AlertTriangle,
    className: "text-red-600",
    badge: "bg-red-100 text-red-700",
    row: "bg-red-50 border-red-100",
    label: "🔴 Critic",
  },
  Apropiat: {
    icon: Clock,
    className: "text-yellow-600",
    badge: "bg-yellow-100 text-yellow-700",
    row: "bg-yellow-50 border-yellow-100",
    label: "🟡 Apropiat",
  },
  Viitor: {
    icon: CheckCircle,
    className: "text-green-600",
    badge: "bg-green-100 text-green-700",
    row: "bg-white border-gray-100",
    label: "🟢 Viitor",
  },
  Expirat: {
    icon: XCircle,
    className: "text-gray-400",
    badge: "bg-gray-100 text-gray-500",
    row: "bg-gray-50 border-gray-100",
    label: "⬛ Expirat",
  },
};

const autoritateBadge: Record<string, string> = {
  ANAF: "bg-blue-100 text-blue-700",
  APIA: "bg-green-100 text-green-700",
  AFIR: "bg-indigo-100 text-indigo-700",
  MADR: "bg-emerald-100 text-emerald-700",
  "Min. Agriculturii": "bg-emerald-100 text-emerald-700",
};

export default function TermenePage() {
  const [activeCategory, setActiveCategory] = useState("Toate");
  const [showExpired, setShowExpired] = useState(false);
  const termene = useMemo(() => computeTermene(), []);

  const criticCount = termene.filter((t) => t.status === "Critic").length;
  const apropiateCount = termene.filter((t) => t.status === "Apropiat").length;
  const viitorCount = termene.filter((t) => t.status === "Viitor").length;
  const expiratCount = termene.filter((t) => t.status === "Expirat").length;

  const filtered = useMemo(() => {
    let list = activeCategory === "Toate"
      ? termene
      : termene.filter((t) => t.categorie === activeCategory);
    if (!showExpired) {
      list = list.filter((t) => t.status !== "Expirat");
    }
    return list;
  }, [termene, activeCategory, showExpired]);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Termene &amp; Obligații</h1>
        <p className="text-gray-500 mt-1">
          Calendar obligații fiscale și agricole 2025–2026 — GRANA FARM SRL
        </p>
      </div>

      {/* Summary cards — 4 counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="text-red-500" size={24} />
          <div>
            <p className="text-2xl font-bold text-red-600">{criticCount}</p>
            <p className="text-xs text-red-500 font-semibold">Critice (&lt;7 zile)</p>
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 flex items-center gap-3">
          <Clock className="text-yellow-500" size={24} />
          <div>
            <p className="text-2xl font-bold text-yellow-600">{apropiateCount}</p>
            <p className="text-xs text-yellow-500 font-semibold">Apropiate (7–30 zile)</p>
          </div>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="text-green-500" size={24} />
          <div>
            <p className="text-2xl font-bold text-green-600">{viitorCount}</p>
            <p className="text-xs text-green-500 font-semibold">Viitoare (&gt;30 zile)</p>
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-center gap-3">
          <XCircle className="text-gray-400" size={24} />
          <div>
            <p className="text-2xl font-bold text-gray-500">{expiratCount}</p>
            <p className="text-xs text-gray-400 font-semibold">Expirate</p>
          </div>
        </div>
      </div>

      {/* Filter tabs + toggle expired */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
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
        <button
          onClick={() => setShowExpired((v) => !v)}
          className={`ml-auto flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
            showExpired
              ? "bg-gray-700 text-white border-gray-700"
              : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
          }`}
        >
          {showExpired ? <EyeOff size={14} /> : <Eye size={14} />}
          {showExpired ? "Ascunde expirate" : "Arată expirate"}
          {!showExpired && expiratCount > 0 && (
            <span className="bg-gray-200 text-gray-600 text-xs font-bold px-1.5 py-0.5 rounded-full">
              {expiratCount}
            </span>
          )}
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-xs font-bold text-gray-500 uppercase px-5 py-4 tracking-wide">
                  Autoritate
                </th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase px-5 py-4 tracking-wide">
                  Obligație
                </th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase px-5 py-4 tracking-wide">
                  Dată limită
                </th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase px-5 py-4 tracking-wide">
                  Status
                </th>
                <th className="text-right text-xs font-bold text-gray-500 uppercase px-5 py-4 tracking-wide">
                  Zile rămase
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400 text-sm">
                    Niciun termen găsit pentru filtrele selectate.
                  </td>
                </tr>
              )}
              {filtered.map((t, i) => {
                const config = statusConfig[t.status];
                const Icon = config.icon;
                return (
                  <tr
                    key={i}
                    className={`border-b ${config.row} transition-colors hover:brightness-95`}
                    title={t.note}
                  >
                    <td className="px-5 py-4">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          autoritateBadge[t.autoritate] || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {t.autoritate}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-gray-800">{t.obligatie}</p>
                      {t.note && (
                        <p className="text-xs text-gray-400 mt-0.5 max-w-sm">{t.note}</p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={14} className="text-gray-400" />
                        {t.dataLimita}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <Icon size={14} className={config.className} />
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${config.badge}`}
                        >
                          {config.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {t.status === "Expirat" ? (
                        <span className="text-sm font-bold text-gray-400">
                          {Math.abs(t.zileRamase)} zile în urmă
                        </span>
                      ) : (
                        <span
                          className={`text-sm font-bold ${
                            t.zileRamase <= 7
                              ? "text-red-600"
                              : t.zileRamase <= 30
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                        >
                          {t.zileRamase} zile
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
