import { NextResponse } from "next/server";
import { askVyayRakshak, buildContext } from "@/lib/ai/assistant";

export const dynamic = "force-dynamic";

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";

async function askGemini(query: string): Promise<string | null> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  const context = buildContext();
  const system =
    "You are VyayRakshak, an MPLADS risk-intelligence assistant. Answer ONLY from the CONTEXT below. " +
    "Be concise (under 120 words), factual and neutral. VyayRakshak flags anomalies for human verification and never determines fraud. " +
    "If the answer is not in the context, say you can only answer from the platform's data and suggest an example question. " +
    "Never invent project IDs, numbers or agencies.\n\nCONTEXT:\n" +
    context;
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents: [{ role: "user", parts: [{ text: query }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 400 },
        }),
        // Don't let a slow provider hang the request forever.
        signal: AbortSignal.timeout(12000),
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts
      ?.map((p: any) => p.text)
      .join("")
      .trim();
    return text || null;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    if (typeof query !== "string" || !query.trim()) {
      return NextResponse.json({ error: "A query string is required." }, { status: 400 });
    }
    const q = query.slice(0, 500);
    const answer = askVyayRakshak(q);

    let text = answer.text;
    let provider: "mock" | "gemini" = "mock";

    // Escalate to Gemini ONLY when the deterministic layer is unsure and a key is set.
    if (!answer.confident) {
      const g = await askGemini(q);
      if (g) {
        text = g;
        provider = "gemini";
      }
    }

    return NextResponse.json({
      text,
      kind: answer.kind,
      provider,
      projects: (answer.projects ?? []).map((p) => ({
        id: p.id,
        name: p.name,
        district: p.district,
        stateName: p.stateName,
        score: p.risk.totalScore,
        level: p.risk.riskLevel,
      })),
    });
  } catch {
    return NextResponse.json({ error: "Unable to process query." }, { status: 500 });
  }
}
