"use client";

import { useState, useMemo } from "react";
import { Calendar, AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react";

interface Termen {
  autoritate: string;
  obligatie: string;
  isoDate: string; // YYYY-MM-DD
  categorie: string;
  note?: string;
}

// Real 2025-2026 Romanian agricultural deadlines
const termeneRaw: Termen[] = [
  // ─── ANAF ───────────────────────────────────────────────────────
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
  // ─── ANAF 2026 ───────────────────────────────────────────────────
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
    obligatie: "D112 – Obligații salariale Ianuarie 2026",
    isoDate: "2026-02-25",
    categorie: "ANAF",
  },
  {
    autoritate: "ANAF",
    obligatie: "D112 – Obligații salariale Februarie 2026",
    isoDate: "2026-03-25",
    categorie: "ANAF",
  },
  {
    autoritate: "ANAF",
    obligatie: "D300 – Decont TVA T1 2026",
    isoDate: "2026-04-25",
    categorie: "ANAF",
  },
  {
    autoritate: "ANAF",
    obligatie: "D100 – Impozit Microîntreprindere T1 2026",
    isoDate: "2026-04-25",
    categorie: "ANAF",
  },
  // ─── APIA ────────────────────────────────────────────────────────
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
  // ─── AFIR ────────────────────────────────────────────────────────
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
  // ─── Min. Agriculturii ──────────────────────────────────────────
  {
    autoritate: "Min. Agriculturii",
    obligatie: "Înregistrare Exploatație Agricolă – permanent (rolling)",
    isoDate: "2026-12-31",
    categorie: "Min. Agriculturii",
    note: "Obligație permanentă — înregistrarea se poate face oricând la DADR județeană.",
  },
  {
    autoritate: "Min. Agriculturii",
    obligatie: "Notificare utilizare produse fitosanitare 2025",
    isoDate: "2025-03-31",
    categorie: "Min. Agriculturii",
  },
];

type StatusType = "Urgent" | "În curs" | "Ok" | "Expirat";

interface ComputedTermen extends Termen {
  dataLimita: string;
  status: StatusType;
  zileRamase: number;
}

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
        status = "Urgent";
      } else if (zileRamase <= 30) {
        status = "În curs";
      } else {
        status = "Ok";
      }

      const d = new Date(t.isoDate);
      const dataLimita = d.toLocaleDateString("ro-RO", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      return { ...t, dataLimita, status, zileRamase };
    })
    .sort((a, b) => a.zileRamase - b.zileRamase);
}

const categories = ["Toate", "ANAF", "APIA", "AFIR", "Min. Agriculturii"];

const statusConfig: Record<
  StatusType,
  { icon: React.ElementType; className: string; badge: string; row: string }
> = {
  Urgent: {
    icon: AlertTriangle,
    className: "text-red-600",
    badge: "bg-red-100 text-red-700",
    row: "bg-red-50 border-red-100",
  },
  "În curs": {
    icon: Clock,
    className: "text-yellow-600",
    badge: "bg-yellow-100 text-yellow-700",
    row: "bg-yellow-50 border-yellow-100",
  },
  Ok: {
    icon: CheckCircle,
    className: "text-green-600",
    badge: "bg-green-100 text-green-700",
    row: "bg-white border-gray-100",
  },
  Expirat: {
    icon: XCircle,
    className: "text-gray-400",
    badge: "bg-gray-100 text-gray-500",
    row: "bg-gray-50 border-gray-100",
  },
};

const autoritateBadge: Record<string, string> = {
  ANAF: "bg-blue-100 text-blue-700",
  APIA: "bg-green-100 text-green-700",
  AFIR: "bg-indigo-100 text-indigo-700",
  "Min. Agriculturii": "bg-emerald-100 text-emerald-700",
};

export default function TermenePage() {
  const [activeCategory, setActiveCategory] = useState("Toate");
  const termene = useMemo(() => computeTermene(), []);

  const filtered =
    activeCategory === "Toate"
      ? termene
      : termene.filter((t) => t.categorie === activeCategory);

  const urgentCount = termene.filter((t) => t.status === "Urgent").length;
  const inCursCount = termene.filter((t) => t.status === "În curs").length;
  const okCount = termene.filter((t) => t.status === "Ok").length;
  const expiratCount = termene.filter((t) => t.status === "Expirat").length;

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Termene & Obligații</h1>
        <p className="text-gray-500 mt-1">
          Calendar obligații fiscale și agricole 2025–2026 — GRANA FARM SRL
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="text-red-500" size={24} />
          <div>
            <p className="text-2xl font-bold text-red-600">{urgentCount}</p>
            <p className="text-xs text-red-500 font-semibold">Urgent (&lt;7 zile)</p>
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 flex items-center gap-3">
          <Clock className="text-yellow-500" size={24} />
          <div>
            <p className="text-2xl font-bold text-yellow-600">{inCursCount}</p>
            <p className="text-xs text-yellow-500 font-semibold">În curs (7–30 zile)</p>
          </div>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="text-green-500" size={24} />
          <div>
            <p className="text-2xl font-bold text-green-600">{okCount}</p>
            <p className="text-xs text-green-500 font-semibold">Ok (&gt;30 zile)</p>
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-center gap-3">
          <XCircle className="text-gray-400" size={24} />
          <div>
            <p className="text-2xl font-bold text-gray-500">{expiratCount}</p>
            <p className="text-xs text-gray-400 font-semibold">Expirat</p>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
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
                          {t.status}
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
