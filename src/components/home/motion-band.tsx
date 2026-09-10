import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { getT } from "@/lib/i18n/server";
import { PlayCircle, ArrowRight, ShieldCheck } from "lucide-react";

export function MotionBand() {
  const { t } = getT();
  return (
    <section className="border-t border-border bg-surface/40 py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-accent-2">
                Motion Showcase
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
                See VyayRakshak in motion
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
                A looped preview of the intelligence pipeline. Open the full
                interactive explainer for the six-scene walkthrough.
              </p>
            </div>
            <ButtonLink href="/showcase" variant="secondary">
              <PlayCircle className="h-4 w-4" /> Open Explainer{" "}
              <ArrowRight className="h-3.5 w-3.5" />
            </ButtonLink>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="relative mt-8 overflow-hidden rounded-2xl plate p-2">
            <video
              className="w-full rounded-xl"
              src="/media/loop.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
            />
            {/* Brand logo bug — sized/positioned to sit directly over the source
               watermark (the ✦ sparkle near 90% width / 83% height of the frame). */}
            <div
              className="pointer-events-none absolute z-10 flex items-center justify-center"
              style={{ left: "76%", top: "72%", width: "22%", height: "18%" }}
              aria-hidden
            >
              <div className="flex items-center gap-1.5 rounded-lg bg-[#efe6d3]/95 px-2.5 py-1.5 shadow-md ring-1 ring-[#d8ccb2] backdrop-blur-sm">
                <ShieldCheck className="h-4 w-4 shrink-0 text-accent" />
                <span className="font-display text-[11px] font-bold leading-none tracking-tight text-accent-2 sm:text-xs">
                  {t("brand.name")}
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Skyline panorama strip */}
      <Reveal>
        <div className="relative mt-16 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/skyline.jpg"
            alt="Illustrated skyline of New Delhi civic landmarks"
            className="mx-auto w-full max-w-7xl opacity-90"
            loading="lazy"
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, hsl(var(--bg)) 0%, transparent 12%, transparent 88%, hsl(var(--bg)) 100%), linear-gradient(0deg, hsl(var(--bg)) 2%, transparent 30%)",
            }}
            aria-hidden
          />
        </div>
      </Reveal>
    </section>
  );
}
