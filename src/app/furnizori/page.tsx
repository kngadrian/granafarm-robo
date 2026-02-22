"use client";

import { useState } from "react";
import { Search, MapPin, Phone } from "lucide-react";

interface Supplier {
  name: string;
  category: string;
  location: string;
  description: string;
  phone?: string;
  website?: string;
}

const suppliers: Supplier[] = [
  // Semințe
  {
    name: "Seminis Romania",
    category: "Semințe",
    location: "București",
    description:
      "Lider mondial în semințe hibrid de legume. Oferă soiuri de roșii, ardei, castraveți și vinete adaptate climei din România.",
    phone: "021-xxx-xxxx",
    website: "seminis.ro",
  },
  {
    name: "Pioneer Romania",
    category: "Semințe",
    location: "Timișoara",
    description:
      "Divizia agricolă Corteva Agriscience. Semințe certificate pentru culturi de câmp și legume, cu suport tehnic dedicat.",
    phone: "0256-xxx-xxx",
    website: "pioneer.com/ro",
  },
  {
    name: "SeedLine Romania",
    category: "Semințe",
    location: "Cluj-Napoca",
    description:
      "Distribuitor autorizat de semințe certificate pentru producători agricoli. Soiuri speciale pentru cultură în sere și solarii.",
    phone: "0264-xxx-xxx",
  },
  {
    name: "Rijk Zwaan Romania",
    category: "Semințe",
    location: "Arad",
    description:
      "Companie olandeză cu tradiție în semințe de legume premium. Soiuri de roșii cherry, salată și ardei kapia pentru export.",
    website: "rijkzwaan.ro",
  },
  // Îngrășăminte
  {
    name: "Compo Expert Romania",
    category: "Îngrășăminte",
    location: "București",
    description:
      "Îngrășăminte foliare și ferti-irigare de înaltă performanță pentru legumicultori. Gamă completă pentru cultură în sere.",
    phone: "021-xxx-xxxx",
    website: "compo-expert.ro",
  },
  {
    name: "Yara Romania",
    category: "Îngrășăminte",
    location: "Constanța",
    description:
      "Lider mondial în îngrășăminte minerale. Produse specializate pentru culturile de legume, cu recomandări agrochimice personalizate.",
    website: "yara.ro",
  },
  {
    name: "Fertena SRL",
    category: "Îngrășăminte",
    location: "Arad",
    description:
      "Distribuitor regional de îngrășăminte complexe NPK, microelemente și amendamente agricole pentru zona de vest a României.",
    phone: "0257-xxx-xxx",
  },
  {
    name: "AgriChem Romania",
    category: "Îngrășăminte",
    location: "Timișoara",
    description:
      "Fertilizanți organici și organo-minerali pentru agricultură ecologică și convențională. Livrare directă la fermă.",
    phone: "0256-xxx-xxx",
  },
  // Irigații
  {
    name: "Irigalex SRL",
    category: "Irigații",
    location: "București",
    description:
      "Sisteme de irigație prin picurare și aspersoare pentru sere și solarii. Proiectare, instalare și service garantat.",
    phone: "021-xxx-xxxx",
    website: "irigalex.ro",
  },
  {
    name: "Aqua-Agri Romania",
    category: "Irigații",
    location: "Timișoara",
    description:
      "Echipamente Netafim și Rain Bird pentru irigare de precizie. Consultanță gratuită pentru dimensionarea sistemelor.",
    website: "aqua-agri.ro",
  },
  {
    name: "DripTech Romania",
    category: "Irigații",
    location: "Oradea",
    description:
      "Benzi de picurare, filtre și pompe de irigare la prețuri competitive. Livrare în toată România, inclusiv Caraș-Severin.",
    phone: "0259-xxx-xxx",
  },
  {
    name: "IrrigaPro SRL",
    category: "Irigații",
    location: "Reșița",
    description:
      "Furnizor local de sisteme de irigare pentru fermierii din Caraș-Severin și Timiș. Service și piese de schimb disponibile.",
    phone: "0255-xxx-xxx",
  },
  // Folii/Sere
  {
    name: "Solplast Romania",
    category: "Folii/Sere",
    location: "Ploiești",
    description:
      "Producător de folii agricole UV-stabilizate, mulci și folii pentru solarii. Grosimi de 150-200 microni, garanție 4 ani.",
    phone: "0244-xxx-xxx",
    website: "solplast.ro",
  },
  {
    name: "SeraTechnic SRL",
    category: "Folii/Sere",
    location: "Pitești",
    description:
      "Construcție solarii metalice și sere profesionale la comandă. Structuri galvanizate, profile din aluminiu, sisteme de ventilație.",
    website: "seratechnic.ro",
  },
  {
    name: "Agriplast Romania",
    category: "Folii/Sere",
    location: "Brașov",
    description:
      "Folii termoizolante multistrat pentru solarii de înaltă performanță. Reducere consum energie cu până la 40%.",
    phone: "0268-xxx-xxx",
  },
  {
    name: "GreenHouse Pro",
    category: "Folii/Sere",
    location: "Cluj-Napoca",
    description:
      "Sisteme complete de sere automatizate: climatizare, irigare computerizată, ecrane termice. Import direct din Olanda.",
    website: "greenhouse-pro.ro",
  },
  // Pesticide
  {
    name: "Dow AgroSciences Romania",
    category: "Pesticide",
    location: "București",
    description:
      "Produse fitosanitare homologate pentru legumicultori: insecticide, fungicide, erbicide. Consiliere agronomică specializată.",
    phone: "021-xxx-xxxx",
    website: "dow-agro.ro",
  },
  {
    name: "Bayer CropScience Romania",
    category: "Pesticide",
    location: "București",
    description:
      "Soluții integrate de protecție a plantelor. Produse cu acțiune sistemică pentru boli și dăunători specifici legumelor.",
    website: "bayer-agro.ro",
  },
  {
    name: "Nufarm Romania",
    category: "Pesticide",
    location: "Cluj-Napoca",
    description:
      "Pesticide generice la prețuri accesibile pentru producătorii de legume. Fungicide pe bază de cupru, insecticide selective.",
    phone: "0264-xxx-xxx",
  },
  {
    name: "FitoPharma SRL",
    category: "Pesticide",
    location: "Reșița",
    description:
      "Distribuitor autorizat de produse fitosanitare în Caraș-Severin. Livrare la fermă, consultanță gratuită de la inginer agronom.",
    phone: "0255-xxx-xxx",
  },
  // Utilaje
  {
    name: "Deutz-Fahr Romania",
    category: "Utilaje",
    location: "Timișoara",
    description:
      "Tractoare și utilaje agricole premium. Service autorizat, piese originale, finanțare prin leasing agricol avantajos.",
    phone: "0256-xxx-xxx",
    website: "deutz-fahr.ro",
  },
  {
    name: "AgriMaș SRL",
    category: "Utilaje",
    location: "Reșița",
    description:
      "Vânzare și service utilaje agricole second-hand recondiționat. Stivuitoare de solarii, motocultivatoare, pompe.",
    phone: "0255-xxx-xxx",
  },
  {
    name: "Horticola Utilaje",
    category: "Utilaje",
    location: "Timișoara",
    description:
      "Utilaje specializate pentru horticulturî: transplantoare, mașini de semănat, linii de sortare legume, ambalatoare.",
    website: "horticola-utilaje.ro",
  },
  {
    name: "AgroTech West",
    category: "Utilaje",
    location: "Arad",
    description:
      "Echipamente de irigare, pulverizatoare și sisteme de climatizare pentru sere. Import direct, prețuri de producător.",
    phone: "0257-xxx-xxx",
  },
];

const categories = ["Toate", "Semințe", "Îngrășăminte", "Irigații", "Folii/Sere", "Pesticide", "Utilaje"];

const categoryColors: Record<string, string> = {
  "Semințe": "bg-green-100 text-green-700",
  "Îngrășăminte": "bg-yellow-100 text-yellow-700",
  "Irigații": "bg-blue-100 text-blue-700",
  "Folii/Sere": "bg-purple-100 text-purple-700",
  "Pesticide": "bg-red-100 text-red-700",
  "Utilaje": "bg-orange-100 text-orange-700",
};

export default function FurnizoriPage() {
  const [activeCategory, setActiveCategory] = useState("Toate");
  const [search, setSearch] = useState("");

  const filtered = suppliers.filter((s) => {
    const matchesCategory = activeCategory === "Toate" || s.category === activeCategory;
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase()) ||
      s.location.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Furnizori Agricoli</h1>
        <p className="text-gray-500 mt-1">Furnizori verificați pentru GRANA FARM SRL</p>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Caută furnizor, locație..."
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm"
        />
      </div>

      {/* Category filters */}
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

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-4">
        {filtered.length} furnizori găsiți
      </p>

      {/* Supplier grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((supplier, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow flex flex-col"
          >
            <div className="flex items-start justify-between mb-3">
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  categoryColors[supplier.category] || "bg-gray-100 text-gray-700"
                }`}
              >
                {supplier.category}
              </span>
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">{supplier.name}</h3>
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
              <MapPin size={12} />
              {supplier.location}
            </div>
            <p className="text-xs text-gray-600 leading-relaxed flex-1 mb-4">
              {supplier.description}
            </p>
            <div className="flex items-center justify-between">
              {supplier.phone && (
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Phone size={12} />
                  {supplier.phone}
                </div>
              )}
              <button className="ml-auto bg-primary text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors">
                Contactează
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg font-semibold">Niciun furnizor găsit</p>
          <p className="text-sm mt-1">Încearcă altă căutare sau categorie</p>
        </div>
      )}
    </div>
  );
}
