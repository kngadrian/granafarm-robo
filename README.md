# 🌿 GRANA FARM — Command Center

**Centrul de comandă agricol pentru GRANA FARM SRL**

> Next.js 14 · TypeScript · Tailwind CSS · OpenAI GPT-4o

---

## Prezentare

GRANA FARM Command Center este o aplicație web profesională pentru gestionarea activității agricole a **GRANA FARM SRL** (CUI 48892842, CAEN 0113 — Cultivarea legumelor și pepenilor, Caraș-Severin).

### Funcționalități principale

| Pagină | Descriere |
|--------|-----------|
| `/` | Dashboard cu știri, termene, date firmă și acțiuni rapide |
| `/chat` | Chat AI cu 6 agenți specializați (ANAF, APIA, AFIR, etc.) |
| `/stiri` | Știri agricole filtrate pe categorii |
| `/furnizori` | Bază de date furnizori agricoli din România |
| `/termene` | Calendar complet obligații fiscale și agricole 2025 |

---

## Instalare

```bash
git clone https://github.com/kngadrian/granafarm-robo.git
cd granafarm-robo
npm install
cp .env.local.example .env.local
# Editați .env.local și adăugați cheia OpenAI
npm run dev
```

---

## Variabile de mediu

| Variabilă | Descriere | Obligatorie |
|-----------|-----------|-------------|
| `OPENAI_API_KEY` | Cheia API OpenAI pentru chat agents | ✅ Da |

---

## Deploy pe Vercel

### Metoda 1: Vercel CLI

```bash
npm i -g vercel
vercel --prod
```

Setați variabila de mediu în Vercel Dashboard:
- `OPENAI_API_KEY` = `sk-...`

### Metoda 2: Import din GitHub

1. Mergeți la [vercel.com/new](https://vercel.com/new)
2. Importați repo-ul `kngadrian/granafarm-robo`
3. Adăugați `OPENAI_API_KEY` în secțiunea **Environment Variables**
4. Click **Deploy**

---

## Agenți AI disponibili

| Agent | Specializare |
|-------|-------------|
| 🏛️ ANAF | Fiscalitate, TVA, declarații |
| 🌾 APIA | Subvenții agricole, cerere unică plată |
| 🇪🇺 AFIR | Fonduri europene, PNDR, PNRR |
| 🌿 Min. Agriculturii | Reglementări, norme fitosanitare |
| 🚚 Furnizori | Găsire furnizori produse agricole |
| 📊 Contabilitate | Contabilitate microîntreprindere |

---

## Stack tehnic

- **Framework:** Next.js 14 (App Router)
- **Limbaj:** TypeScript
- **Styling:** Tailwind CSS
- **AI:** OpenAI GPT-4o
- **Iconițe:** Lucide React
- **Deploy:** Vercel

---

## Companie

**GRANA FARM SRL**  
CUI: 48892842  
CAEN: 0113 — Cultivarea legumelor și pepenilor, rădăcinoaselor și tuberculilor  
Județ: Caraș-Severin  
Website: [granafarm.ro](https://granafarm.ro)

---

*Built with ❤️ for Romanian agriculture*
