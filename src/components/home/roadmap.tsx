import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { Eye, Search, Gauge, ClipboardCheck, CheckCircle2, ArrowRight } from "lucide-react";
import { getT } from "@/lib/i18n/server";

const STAGES = [
  { icon: Eye, tk: "roadmap.s1" },
  { icon: Search, tk: "roadmap.s2" },
  { icon: Gauge, tk: "roadmap.s3" },
  { icon: ClipboardCheck, tk: "roadmap.s4" },
  { icon: CheckCircle2, tk: "roadmap.s5" },
];

export function Roadmap() {
  const { t } = getT();
  return (
    <section className="border-y border-border bg-surface/40 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent-2">
            {t("roadmap.eyebrow")}
          </p>
          <h2 className="mx-auto mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
            {t("roadmap.title")}
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-5">
          {STAGES.map((s, i) => (
            <Reveal key={s.tk} delay={i * 0.08}>
              <div className="plate plate-raised relative flex h-full flex-col p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/12 ring-1 ring-accent/30">
                    <s.icon className="h-5 w-5 text-accent-2" />
                  </div>
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-faint">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-base font-semibold text-fg">
                  {t(s.tk)}
                </h3>
                {i < STAGES.length - 1 && (
                  <ArrowRight className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-border md:block" />
                )}
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 text-center">
          <ButtonLink href="/dashboard" size="lg" className="btn-3d">
            {t("actions.exploreDashboard")} <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
