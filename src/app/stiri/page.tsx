"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";

const allNews = [
  {
    title: "APIA: Cererea unică de plată 2025 – Ghid complet pentru fermieri",
    source: "APIA",
    date: "18 Feb 2025",
    category: "APIA",
    description:
      "Agenția de Plăți și Intervenție pentru Agricultură a publicat ghidul pentru campania de depunere a cererilor unice de plată pentru subvențiile 2025, cu toate modificările față de anul anterior.",
  },
  {
    title: "ANAF: Termenele declarațiilor fiscale pentru trimestrul I 2025",
    source: "ANAF",
    date: "15 Feb 2025",
    category: "ANAF",
    description:
      "Agenția Națională de Administrare Fiscală reamintește contribuabililor termenele de depunere a declarațiilor D100, D300 și D394 pentru trimestrul I al anului 2025.",
  },
  {
    title: "Prețuri legume: creștere de 12% pe piețele en-gros",
    source: "Agerpres",
    date: "14 Feb 2025",
    category: "Piețe",
    description:
      "Piețele en-gros din România înregistrează o creștere de 12% a prețurilor la legume față de aceeași perioadă a anului trecut, datorită condițiilor meteo nefavorabile.",
  },
  {
    title: "AFIR: Sesiune nouă PNDR pentru finanțarea solariilor agricole",
    source: "AFIR",
    date: "12 Feb 2025",
    category: "AFIR",
    description:
      "AFIR a deschis o nouă sesiune de depunere proiecte pentru sub-măsura 4.1 – Investiții în exploatații agricole, cu accent pe modernizarea solariilor și serelor.",
  },
  {
    title: "Min. Agriculturii: Noi norme fitosanitare pentru legumicultori",
    source: "MADR",
    date: "10 Feb 2025",
    category: "Legislație",
    description:
      "Ministerul Agriculturii și Dezvoltării Rurale a publicat noi norme fitosanitare obligatorii privind tratamentele aplicate în sere și solarii pentru sezonul 2025.",
  },
  {
    title: "Subvenții agricole 2025: ce se schimbă față de anii anteriori",
    source: "Agricultura.ro",
    date: "8 Feb 2025",
    category: "APIA",
    description:
      "Analiza completă a modificărilor din schema de subvenții APIA pentru 2025, inclusiv noile eco-scheme, condiționalitățile de mediu și plățile redistributive.",
  },
  {
    title: "ANAF: Clarificări privind TVA-ul în agriculturâ pentru 2025",
    source: "ANAF",
    date: "6 Feb 2025",
    category: "ANAF",
    description:
      "Direcția de Legislație Fiscală a ANAF a emis circulare de clarificare privind regimul TVA aplicabil produselor agroalimentare comercializate direct de producători.",
  },
  {
    title: "Fonduri europene: 500 milioane euro disponibili pentru agricultura românească",
    source: "EurActiv RO",
    date: "5 Feb 2025",
    category: "AFIR",
    description:
      "Comisia Europeană a aprobat pachetul de finanțare adițional pentru agricultura românească prin PNRR, vizând digitalizarea fermelor și reducerea emisiilor de carbon.",
  },
  {
    title: "Legumele românești câștigă teren pe piețele europene",
    source: "Profit.ro",
    date: "4 Feb 2025",
    category: "Piețe",
    description:
      "Exporturile de legume românești au crescut cu 23% în 2024 față de 2023, Caraș-Severin și Timiș fiind printre județele cu cea mai mare creștere a volumelor exportate.",
  },
  {
    title: "Legea nr. 17/2025: Noi reglementări pentru producătorii agricoli mici",
    source: "Monitorul Oficial",
    date: "3 Feb 2025",
    category: "Legislație",
    description:
      "A intrat în vigoare noua lege care simplifică procedurile administrative pentru microîntreprinderile agricole cu suprafețe de până la 10 hectare.",
  },
  {
    title: "APIA: Cum se calculează plățile eco-schemă pentru 2025",
    source: "APIA",
    date: "1 Feb 2025",
    category: "APIA",
    description:
      "Ghidul practic APIA explică metodologia de calcul a plăților eco-schemă, inclusiv cerințele de rotație a culturilor și menținerea terenurilor necultivate.",
  },
  {
    title: "Semințe certificate 2025: lista soiurilor admise pentru România",
    source: "MADR",
    date: "28 Ian 2025",
    category: "Legislație",
    description:
      "Ministerul Agriculturii a publicat lista actualizată a soiurilor de legume certificate pentru comercializare și cultivare în România în sezonul 2025.",
  },
];

const categories = ["Toate", "APIA", "ANAF", "AFIR", "Piețe", "Legislație"];

const sourceBadgeColors: Record<string, string> = {
  APIA: "bg-green-100 text-green-700",
  ANAF: "bg-blue-100 text-blue-700",
  AFIR: "bg-indigo-100 text-indigo-700",
  MADR: "bg-emerald-100 text-emerald-700",
  Agerpres: "bg-gray-100 text-gray-700",
  "Agricultura.ro": "bg-yellow-100 text-yellow-700",
  "EurActiv RO": "bg-purple-100 text-purple-700",
  "Profit.ro": "bg-orange-100 text-orange-700",
  "Monitorul Oficial": "bg-red-100 text-red-700",
};

export default function StiriPage() {
  const [activeCategory, setActiveCategory] = useState("Toate");

  const filtered =
    activeCategory === "Toate"
      ? allNews
      : allNews.filter((n) => n.category === activeCategory);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Știri Agricole</h1>
        <p className="text-gray-500 mt-1">Ultimele noutăți pentru GRANA FARM SRL</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
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
              <span className="text-xs text-gray-400 flex-shrink-0">{item.date}</span>
            </div>
            <h3 className="text-sm font-bold text-gray-900 leading-snug mb-2 line-clamp-2">
              {item.title}
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 flex-1">
              {item.description}
            </p>
            <a
              href="#"
              className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              Citește mai mult
              <ExternalLink size={12} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
