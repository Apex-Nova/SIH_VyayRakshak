import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { MapPinned, Crosshair, ArrowRight } from "lucide-react";
import { getT } from "@/lib/i18n/server";

export function PreviewBand() {
  const { t } = getT();
  return (
    <section className="py-20">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2">
        <Reveal>
          <div className="plate plate-raised group relative flex h-full flex-col overflow-hidden p-7">
            <div className="absolute inset-0 bg-grid opacity-15" aria-hidden />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/india-map.jpg"
              alt="Map of India"
              className="pointer-events-none absolute -right-6 -top-6 h-40 w-40 rounded-xl object-cover opacity-70"
              loading="lazy"
            />
            <div className="relative">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent/12 ring-1 ring-accent/30">
                <MapPinned className="h-5 w-5 text-accent-2" />
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold text-fg">
                {t("preview.mapTitle")}
              </h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
                {t("preview.mapBody")}
              </p>
              <ButtonLink href="/map" className="mt-5" variant="secondary">
                {t("actions.openMap")} <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="plate plate-raised group relative flex h-full flex-col overflow-hidden p-7">
            <div className="absolute inset-0 bg-grid opacity-15" aria-hidden />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/dossier.jpg"
              alt="AI risk dossier"
              className="pointer-events-none absolute -right-6 -top-6 h-40 w-40 rounded-xl object-cover opacity-80"
              loading="lazy"
            />
            <div className="relative">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent/12 ring-1 ring-accent/30">
                <Crosshair className="h-5 w-5 text-accent-2" />
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold text-fg">
                {t("preview.invTitle")}
              </h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
                {t("preview.invBody")}
              </p>
              <ButtonLink href="/investigation" className="mt-5" variant="secondary">
                {t("actions.openInvestigation")} <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function ClosingCTA() {
  const { t } = getT();
  return (
    <section className="relative overflow-hidden border-t border-border py-24">
      <div className="absolute inset-0 bg-radial-accent" aria-hidden />
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <Reveal>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
            {t("closing.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted">{t("closing.body")}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/dashboard" size="lg" className="btn-3d">
              {t("actions.exploreDashboard")} <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="/report" variant="outline" size="lg">
              {t("actions.report")}
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
