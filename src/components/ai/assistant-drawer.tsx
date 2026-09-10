"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X, Send, Bot, ArrowRight } from "lucide-react";
import { RiskBadge } from "@/components/ui/badge";
import type { RiskLevel } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AnswerProject {
  id: string;
  name: string;
  district: string;
  stateName: string;
  score: number;
  level: RiskLevel;
}

interface Turn {
  role: "user" | "assistant";
  text: string;
  projects?: AnswerProject[];
}

const SUGGESTIONS = [
  "Highest-risk works",
  "Worst agency",
  "Show duplicate works",
  "What is March Rush?",
  "High-risk works in Bihar",
  "Why is work 100005 high risk?",
];

export function AssistantDrawer() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([
    {
      role: "assistant",
      text: "Namaste. I'm VyayRakshak. Ask me about projects, risk, agencies or financials — I answer from the platform's data. I identify anomalies for human verification; I do not determine fraud.",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  async function submit(q: string) {
    const query = q.trim();
    if (!query || loading) return;
    setInput("");
    setTurns((t) => [...t, { role: "user", text: query }]);
    setLoading(true);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setTurns((t) => [
        ...t,
        { role: "assistant", text: data.text, projects: data.projects },
      ]);
    } catch {
      setTurns((t) => [
        ...t,
        { role: "assistant", text: "Sorry — I couldn't reach the intelligence layer. Please retry." },
      ]);
    } finally {
      setLoading(false);
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ top: 1e9, behavior: "smooth" });
      });
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-semibold text-on-accent shadow-[0_10px_40px_-8px_hsl(var(--accent)/0.8)] transition-transform hover:scale-105"
        aria-label="Ask VyayRakshak"
      >
        <Sparkles className="h-4 w-4" />
        <span className="hidden sm:inline">Ask VyayRakshak</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-border bg-surface"
              role="dialog"
              aria-label="VyayRakshak assistant"
            >
              <div className="flex items-center justify-between border-b border-border p-4">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent/15 ring-1 ring-accent/40">
                    <Bot className="h-5 w-5 text-accent" />
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-fg">VyayRakshak</div>
                    <div className="text-[11px] text-faint">
                      Decision-support · Demo intelligence layer
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-surface-2"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4 scroll-thin">
                {turns.map((t, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex",
                      t.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                        t.role === "user"
                          ? "bg-accent/90 text-on-accent"
                          : "bg-surface-2 text-fg"
                      )}
                    >
                      <p>{t.text}</p>
                      {t.projects && t.projects.length > 0 && (
                        <div className="mt-2.5 space-y-1.5">
                          {t.projects.map((p) => (
                            <Link
                              key={p.id}
                              href={`/projects/${p.id}`}
                              onClick={() => setOpen(false)}
                              className="flex items-center justify-between gap-2 rounded-lg border border-border bg-surface px-2.5 py-2 transition-colors hover:border-accent/40"
                            >
                              <div className="min-w-0">
                                <div className="truncate text-xs font-medium text-fg">
                                  {p.name}
                                </div>
                                <div className="truncate text-[11px] text-faint">
                                  {p.district}, {p.stateName} · #{p.id}
                                </div>
                              </div>
                              <RiskBadge level={p.level} score={p.score} showSymbol={false} />
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl bg-surface-2 px-3.5 py-2.5">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            className="h-1.5 w-1.5 animate-pulse-node rounded-full bg-accent"
                            style={{ animationDelay: `${i * 0.15}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {turns.length <= 1 && (
                <div className="flex flex-wrap gap-1.5 border-t border-border px-4 pt-3">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => submit(s)}
                      className="rounded-full border border-border bg-surface-2 px-2.5 py-1 text-[11px] text-muted transition-colors hover:border-accent/40 hover:text-fg"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submit(input);
                }}
                className="flex items-center gap-2 border-t border-border p-3"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about projects, risk, agencies…"
                  className="h-10 flex-1 rounded-lg border border-border bg-surface-2 px-3 text-sm text-fg placeholder:text-faint focus:border-accent focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-on-accent disabled:opacity-40"
                  aria-label="Send"
                >
                  {loading ? <ArrowRight className="h-4 w-4" /> : <Send className="h-4 w-4" />}
                </button>
              </form>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
