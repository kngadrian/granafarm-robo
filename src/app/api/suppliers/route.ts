/* eslint-disable @typescript-eslint/no-explicit-any */
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import OpenAI from "openai";

const CACHE_KEY = "granafarm:suppliers:caen0113";
const CACHE_TTL = 60 * 60 * 24 * 30; // 30 days

const AI_PROMPT = `Ești un expert în aprovizionare agricolă în România. 
Compania GRANA FARM SRL are codul CAEN 0113 (cultivarea legumelor și pepenilor în solarii/sere), localizată în Caraș-Severin.

Generează o listă de furnizori REALI și RELEVANȚI din România pentru această companie, organizați pe categorii. 

Returnează DOAR JSON (fără text suplimentar) cu această structură EXACTĂ:
{
  "suppliers": [
    {
      "id": "1",
      "name": "Nume Furnizor",
      "category": "Seminte",
      "location": "Judet/Oras",
      "products": "Produse principale scurte",
      "website": "https://... sau null",
      "relevance": "De ce e relevant pentru legume in solarii"
    }
  ],
  "generatedAt": "2026-02-22T00:00:00Z"
}

Categorii valide: Seminte, Ingrasaminte, Irigatii, Folii/Sere, Pesticide, Utilaje, Transport, Altele
Include minim 5 furnizori per categorie pentru: Seminte, Ingrasaminte, Irigatii, Folii/Sere, Pesticide, Utilaje.
Furnizori reali din Romania — nu inventa companii inexistente.`;

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

async function generateWithAI(): Promise<SuppliersData> {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  // Try Responses API with web search (gpt-5.2)
  try {
    const response = await client.responses.create({
      model: "gpt-5.2",
      tools: [{ type: "web_search_preview" as any }],
      input: [{ role: "user", content: AI_PROMPT }],
    });

    const outputText = (response.output as any[])
      .filter((o: any) => o.type === "message")
      .map((o: any) =>
        (o.content as any[])
          .filter((c: any) => c.type === "output_text")
          .map((c: any) => c.text as string)
          .join("")
      )
      .join("");

    const jsonMatch = outputText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        suppliers: parsed.suppliers || [],
        generatedAt: parsed.generatedAt || new Date().toISOString(),
      };
    }
  } catch (e1: unknown) {
    // Fallback to Chat Completions with gpt-4o
    const warn1 = e1 instanceof Error ? e1.message : String(e1);
    console.warn("Responses API failed for suppliers:", warn1);

    try {
      const completion = await client.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: AI_PROMPT }],
        response_format: { type: "json_object" },
        max_tokens: 4000,
      });

      const content = completion.choices[0]?.message?.content || "{}";
      const parsed = JSON.parse(content);
      return {
        suppliers: parsed.suppliers || [],
        generatedAt: new Date().toISOString(),
      };
    } catch (e2: unknown) {
      const warn2 = e2 instanceof Error ? e2.message : String(e2);
      console.error("Chat completions also failed for suppliers:", warn2);
    }
  }

  return { suppliers: [], generatedAt: new Date().toISOString() };
}

export async function GET() {
  const kvConfigured =
    !!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN;

  if (kvConfigured) {
    try {
      const { kv } = await import("@vercel/kv");

      // Check cache
      const cached = await kv.get<SuppliersData>(CACHE_KEY);
      if (cached && Array.isArray(cached.suppliers) && cached.suppliers.length > 0) {
        return NextResponse.json(cached);
      }

      // Generate with AI
      const data = await generateWithAI();

      // Save to cache (best effort)
      try {
        await kv.set(CACHE_KEY, data, { ex: CACHE_TTL });
      } catch (cacheErr: unknown) {
        console.warn("KV cache save failed:", cacheErr);
      }

      return NextResponse.json(data);
    } catch (kvErr: unknown) {
      console.warn("KV access failed, falling back to direct AI:", kvErr);
      // Fall through to direct AI generation below
    }
  }

  // No KV configured or KV failed — generate directly
  const data = await generateWithAI();
  return NextResponse.json(data);
}
