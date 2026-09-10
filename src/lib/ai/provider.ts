// ─── LLM provider abstraction ───────────────────────────────────────────────
// The app is not coupled to any single provider. When no API key is configured
// (the default for the demo), a deterministic mock layer answers queries using
// the application's own data — no external calls are faked.

export type AIProviderName = "mock" | "anthropic" | "openai";

export interface AIMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AIProvider {
  readonly name: AIProviderName;
  readonly live: boolean;
}

export function getAIProvider(): AIProvider {
  const configured = (process.env.AI_PROVIDER as AIProviderName) || "mock";
  const hasKey =
    (configured === "anthropic" && !!process.env.ANTHROPIC_API_KEY) ||
    (configured === "openai" && !!process.env.OPENAI_API_KEY);
  if (hasKey) return { name: configured, live: true };
  return { name: "mock", live: false };
}
