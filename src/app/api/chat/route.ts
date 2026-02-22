/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const WEB_SEARCH_INSTRUCTION = `\nFolosește căutarea pe internet pentru a oferi informații actualizate și precise. Când răspunzi la întrebări despre termene, legi, sau prețuri — caută întotdeauna date recente.`;

const systemPrompts: Record<string, string> = {
  anaf: `Ești un expert contabil și fiscal român specializat în relația cu ANAF. Cunoști perfect: declarațiile fiscale (D100, D101, D112, D300, D390, D394, D406 SAF-T), termenele de depunere, procedurile de înregistrare fiscală, TVA, impozit micro, verificări fiscale. Compania ta: GRANA FARM SRL, CUI 48892842, microîntreprindere agricolă, Caraș-Severin, CAEN 0113. Răspunzi în română, concis și precis.${WEB_SEARCH_INSTRUCTION}`,

  apia: `Ești expert în subvenții agricole APIA. Cunoști: cererea unică de plată, scheme sprijin suprafață, plăți practici agricole benefice, eco-scheme, ajutoare de stat, termene și documente necesare. Compania: GRANA FARM SRL, CUI 48892842, CAEN 0113 (legume în solarii), Caraș-Severin, microîntreprindere. Răspunzi în română.${WEB_SEARCH_INSTRUCTION}`,

  afir: `Ești expert în fonduri europene agricole prin AFIR. Cunoști PNDR, PNRR, măsuri finanțare microîntreprinderi agricole, condiții eligibilitate, documente necesare. Compania: GRANA FARM SRL, CUI 48892842, microîntreprindere agricolă. Răspunzi în română.${WEB_SEARCH_INSTRUCTION}`,

  "ministerul-agriculturii": `Ești expert în legislația Ministerului Agriculturii din România. Cunoști: legile producției vegetale, norme sere și solarii, înregistrarea exploatațiilor agricole, norme fitosanitare, standarde calitate legume. CAEN 0113. Răspunzi în română.${WEB_SEARCH_INSTRUCTION}`,

  furnizori: `Ești agent specializat în găsirea furnizorilor de produse agricole în România. Ajuți cu: semințe, răsaduri, îngrășăminte, pesticide, sisteme irigații, folii sere, echipamente. Oferi liste furnizori cunoscuți din România cu detalii. Compania: GRANA FARM SRL, producător legume în solarii, Caraș-Severin. Răspunzi în română.${WEB_SEARCH_INSTRUCTION}`,

  contabilitate: `Ești contabil expert în microîntreprinderi agricole România. Cunoști: regim microîntreprinderi, TVA agricol, registru casă, balanță verificare, bilanț anual, documente contabile obligatorii. Compania: GRANA FARM SRL, CUI 48892842, microîntreprindere. Răspunzi în română.${WEB_SEARCH_INSTRUCTION}`,
};

export async function POST(req: NextRequest) {
  try {
    const { message, agent, history } = await req.json();

    if (!message || !agent) {
      return NextResponse.json({ error: "Missing message or agent" }, { status: 400 });
    }

    const systemPrompt = systemPrompts[agent] || systemPrompts.anaf;

    // Try Responses API with gpt-5.2 and web_search_preview
    try {
      const response = await client.responses.create({
        model: "gpt-5.2",
        tools: [{ type: "web_search_preview" }],
        input: [
          { role: "system", content: systemPrompt },
          ...(history || []).map((m: { role: string; content: string }) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          })),
          { role: "user", content: message },
        ],
      });

      // Extract text output from Responses API
      const output = (response.output as any[])
        .filter((o: any) => o.type === "message")
        .map((o: any) =>
          (o.content as any[])
            .filter((c: any) => c.type === "output_text")
            .map((c: any) => c.text as string)
            .join("")
        )
        .join("");

      return NextResponse.json({ message: output || "Nu am putut genera un răspuns." });
    } catch (responsesError: unknown) {
      // Fallback: if Responses API fails (model not found, etc.), use Chat Completions with gpt-5.2
      const errMsg = responsesError instanceof Error ? responsesError.message : String(responsesError);
      console.warn("Responses API error, falling back to Chat Completions:", errMsg);

      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        { role: "system", content: systemPrompt },
        ...(history || []).map(
          (h: { role: string; content: string }) =>
            ({
              role: h.role as "user" | "assistant",
              content: h.content,
            }) satisfies OpenAI.Chat.ChatCompletionMessageParam
        ),
        { role: "user", content: message },
      ];

      const completion = await client.chat.completions.create({
        model: "gpt-5.2",
        messages,
        max_tokens: 1024,
        temperature: 0.7,
      });

      const responseMessage =
        completion.choices[0]?.message?.content || "Nu am putut genera un răspuns.";
      return NextResponse.json({ message: responseMessage });
    }
  } catch (error: unknown) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
