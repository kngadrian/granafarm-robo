import Link from "next/link";
import {
  MessageSquare,
  Truck,
  Calendar,
  FileText,
  ExternalLink,
  Building2,
  TrendingUp,
} from "lucide-react";

const newsItems = [
  {
    title: "APIA: Cererea unică de plată 2025 – Ghid complet pentru fermieri",
    source: "APIA.org.ro",
    date: "18 Feb 2025",
    description:
      "Agenția de Plăți și Intervenție pentru Agricultură a publicat ghidul pentru campania de depunere a cererilor unice de plată pentru subvențiile 2025.",
    href: "#",
  },
  {
    title: "ANAF: Termenele declarațiilor fiscale pentru trimestrul I 2025",
    source: "ANAF.ro",
    date: "15 Feb 2025",
    description:
      "Agenția Națională de Administrare Fiscală reamintește contribuabililor termenele de depunere a declarațiilor D100, D300 și D394 pentru T1 2025.",
    href: "#",
  },
  {
    title: "Prețuri legume: creștere de 12% pe piețele en-gros din România",
    source: "Agerpres",
    date: "14 Feb 2025",
    description:
      "Piețele en-gros din România înregistrează o creștere semnificativă a prețurilor la legume, în special roșii, ardei și castraveți în sezon de iarnă.",
    href: "#",
  },
  {
    title: "AFIR: Sesiune nouă PNDR pentru finanțarea solariilor agricole",
    source: "AFIR.ro",
    date: "12 Feb 2025",
    description:
      "AFIR a deschis o nouă sesiune de finanțare prin PNDR pentru construirea și dotarea solariilor și serelor destinate producătorilor agricoli din România.",
    href: "#",
  },
  {
    title: "Min. Agriculturii: Noi norme fitosanitare pentru legumicultori",
    source: "Madr.ro",
    date: "10 Feb 2025",
    description:
      "Ministerul Agriculturii a publicat noi norme fitosanitare obligatorii pentru legumicultorii din România, cu accent pe utilizarea pesticidelor omologate.",
    href: "#",
  },
  {
    title: "Subvenții agricole 2025: Ce se schimbă față de anii anteriori",
    source: "Agricultura.ro",
    date: "8 Feb 2025",
    description:
      "Analiza modificărilor din schema de subvenții agricole pentru 2025, inclusiv noile cerințe eco-scheme și condiționalitățile de mediu.",
    href: "#",
  },
];

const termeneData = [
  {
    label: "APIA – Cerere unică de plată 2025",
    date: "2025-03-01",
    daysLeft: 7,
    color: "red" as const,
  },
  {
    label: "ANAF – D300 TVA trimestrul IV 2024",
    date: "2025-02-25",
    daysLeft: 3,
    color: "red" as const,
  },
  {
    label: "AFIR – Depunere dosar PNDR sesiunea I",
    date: "2025-03-28",
    daysLeft: 34,
    color: "green" as const,
  },
  {
    label: "ANAF – D112 obligații salariale februarie",
    date: "2025-03-25",
    daysLeft: 31,
    color: "green" as const,
  },
  {
    label: "Min. Agri – Înregistrare exploatație agricolă",
    date: "2025-03-10",
    daysLeft: 16,
    color: "yellow" as const,
  },
];

const colorMap = {
  red: "bg-red-50 border-red-200 text-red-700",
  yellow: "bg-yellow-50 border-yellow-200 text-yellow-700",
  green: "bg-green-50 border-green-200 text-green-700",
};

const badgeMap = {
  red: "bg-red-100 text-red-700",
  yellow: "bg-yellow-100 text-yellow-700",
  green: "bg-green-100 text-green-700",
};

export default function DashboardPage() {
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
            <Link href="/stiri" className="text-sm text-primary font-semibold hover:underline">
              Toate →
            </Link>
          </div>
          <div className="space-y-4">
            {newsItems.slice(0, 4).map((item, i) => (
              <div key={i} className="pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs font-medium text-primary bg-green-50 px-2 py-0.5 rounded-full">
                        {item.source}
                      </span>
                      <span className="text-xs text-gray-400">{item.date}</span>
                    </div>
                  </div>
                  <ExternalLink size={14} className="text-gray-300 flex-shrink-0 mt-1" />
                </div>
              </div>
            ))}
          </div>
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
            {termeneData.map((item, i) => (
              <div
                key={i}
                className={`flex items-center justify-between p-3 rounded-xl border ${colorMap[item.color]}`}
              >
                <div>
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p className="text-xs opacity-75 mt-0.5">{item.date}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${badgeMap[item.color]}`}>
                  {item.daysLeft}z
                </span>
              </div>
            ))}
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
