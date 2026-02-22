"use client";

import { useState } from "react";
import { Calendar, AlertTriangle, CheckCircle, Clock } from "lucide-react";

interface Termen {
  autoritate: string;
  obligatie: string;
  dataLimita: string;
  status: "Urgent" | "În curs" | "Ok" | "Completat";
  zileRamase: number;
  categorie: string;
}

const termene: Termen[] = [
  {
    autoritate: "ANAF",
    obligatie: "D300 – Decont TVA trimestrul IV 2024",
    dataLimita: "25 Feb 2025",
    status: "Urgent",
    zileRamase: 3,
    categorie: "ANAF",
  },
  {
    autoritate: "APIA",
    obligatie: "Cererea unică de plată – campania 2025",
    dataLimita: "01 Mar 2025",
    status: "Urgent",
    zileRamase: 7,
    categorie: "APIA",
  },
  {
    autoritate: "ANAF",
    obligatie: "D394 – Declarație informativă operațiuni TVA",
    dataLimita: "28 Feb 2025",
    status: "Urgent",
    zileRamase: 6,
    categorie: "ANAF",
  },
  {
    autoritate: "ANAF",
    obligatie: "D112 – Obligații salariale luna ianuarie 2025",
    dataLimita: "25 Feb 2025",
    status: "Urgent",
    zileRamase: 3,
    categorie: "ANAF",
  },
  {
    autoritate: "Min. Agriculturii",
    obligatie: "Înregistrare exploatație agricolă 2025",
    dataLimita: "10 Mar 2025",
    status: "În curs",
    zileRamase: 16,
    categorie: "Min. Agriculturii",
  },
  {
    autoritate: "ANAF",
    obligatie: "D100 – Impozit microîntreprindere T4 2024",
    dataLimita: "25 Mar 2025",
    status: "În curs",
    zileRamase: 31,
    categorie: "ANAF",
  },
  {
    autoritate: "ANAF",
    obligatie: "D112 – Obligații salariale luna februarie 2025",
    dataLimita: "25 Mar 2025",
    status: "Ok",
    zileRamase: 31,
    categorie: "ANAF",
  },
  {
    autoritate: "AFIR",
    obligatie: "Depunere dosar PNDR sub-măsura 4.1",
    dataLimita: "28 Mar 2025",
    status: "Ok",
    zileRamase: 34,
    categorie: "AFIR",
  },
  {
    autoritate: "APIA",
    obligatie: "Modificare cerere unică de plată",
    dataLimita: "31 Mar 2025",
    status: "Ok",
    zileRamase: 37,
    categorie: "APIA",
  },
  {
    autoritate: "ANAF",
    obligatie: "D300 – Decont TVA trimestrul I 2025",
    dataLimita: "25 Apr 2025",
    status: "Ok",
    zileRamase: 62,
    categorie: "ANAF",
  },
  {
    autoritate: "ANAF",
    obligatie: "Situații financiare anuale 2024",
    dataLimita: "30 Apr 2025",
    status: "Ok",
    zileRamase: 67,
    categorie: "ANAF",
  },
  {
    autoritate: "APIA",
    obligatie: "Raportare intermediară subvenții bovine",
    dataLimita: "15 Mai 2025",
    status: "Ok",
    zileRamase: 82,
    categorie: "APIA",
  },
  {
    autoritate: "AFIR",
    obligatie: "Raportare proiect PNRR – progres fizic",
    dataLimita: "30 Mai 2025",
    status: "Ok",
    zileRamase: 97,
    categorie: "AFIR",
  },
  {
    autoritate: "Min. Agriculturii",
    obligatie: "Depunere plan agromediu și climă",
    dataLimita: "01 Iun 2025",
    status: "Ok",
    zileRamase: 99,
    categorie: "Min. Agriculturii",
  },
  {
    autoritate: "ANAF",
    obligatie: "D390 – Declarație recapitulativă TVA intracomunitar",
    dataLimita: "25 Iun 2025",
    status: "Ok",
    zileRamase: 123,
    categorie: "ANAF",
  },
  {
    autoritate: "APIA",
    obligatie: "Regularizare plăți directe campania 2024",
    dataLimita: "30 Iun 2025",
    status: "Ok",
    zileRamase: 128,
    categorie: "APIA",
  },
  {
    autoritate: "AFIR",
    obligatie: "Sesiunea II depunere proiecte PNDR 6.3",
    dataLimita: "31 Oct 2025",
    status: "Ok",
    zileRamase: 251,
    categorie: "AFIR",
  },
];

const categories = ["Toate", "ANAF", "APIA", "AFIR", "Min. Agriculturii"];

const statusConfig = {
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
  Completat: {
    icon: CheckCircle,
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

  const filtered =
    activeCategory === "Toate"
      ? termene
      : termene.filter((t) => t.categorie === activeCategory);

  const urgentCount = termene.filter((t) => t.zileRamase < 7).length;
  const inCursCount = termene.filter((t) => t.zileRamase >= 7 && t.zileRamase < 30).length;
  const okCount = termene.filter((t) => t.zileRamase >= 30).length;

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Termene & Obligații</h1>
        <p className="text-gray-500 mt-1">Calendar obligații fiscale și agricole 2025 — GRANA FARM SRL</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
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
            <p className="text-xs text-yellow-500 font-semibold">În curs (7-30 zile)</p>
          </div>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="text-green-500" size={24} />
          <div>
            <p className="text-2xl font-bold text-green-600">{okCount}</p>
            <p className="text-xs text-green-500 font-semibold">Ok (&gt;30 zile)</p>
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
                  <tr key={i} className={`border-b ${config.row} transition-colors hover:brightness-95`}>
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
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${config.badge}`}>
                          {t.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span
                        className={`text-sm font-bold ${
                          t.zileRamase < 7
                            ? "text-red-600"
                            : t.zileRamase < 30
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {t.zileRamase} zile
                      </span>
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
