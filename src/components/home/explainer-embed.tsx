import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { Presentation, Maximize2 } from "lucide-react";

export function ExplainerEmbed() {
  return (
    <section
      id="presentation"
      className="scroll-mt-20 border-t border-border bg-surface/40 py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="text-center">
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent-2">
            <Presentation className="h-4 w-4" /> Team Synaptix · SIH26102
          </p>
          <h2 className="mx-auto mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
            The Full Interactive Presentation
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted">
            A six-scene motion walkthrough — the problem, the conveyor
            transformation, the nine detectors, evidence hashing, the competitive
            edge, and the pitch. Play it right here.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-10">
            <iframe
              src="/explainer-embed.html"
              title="VyayRakshak interactive explainer presentation"
              className="aspect-video min-h-[420px] w-full border-0 bg-transparent"
              style={{ background: "transparent" }}
              loading="lazy"
            />
          </div>
          <div className="mt-4 text-center">
            <ButtonLink href="/showcase" variant="secondary" size="sm">
              <Maximize2 className="h-3.5 w-3.5" /> Open full-screen
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
