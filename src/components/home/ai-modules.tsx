"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Wallet,
  GitCompareArrows,
  Scale,
  CopyCheck,
  Timer,
  ImageOff,
  Building2,
  MapPinned,
  CalendarClock,
  X,
  FlaskConical,
  Sparkles,
} from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { DetectorDemo, type DetectorKey } from "./detector-demo";
import { useI18n } from "@/lib/i18n/provider";

const MODULES: {
  key: DetectorKey;
  icon: typeof Wallet;
  titleKey: string;
  descKey: string;
  ours?: boolean;
}[] = [
  { key: "financial", icon: Wallet, titleKey: "detectors.financialT", descKey: "detectors.financialD" },
  { key: "progress", icon: GitCompareArrows, titleKey: "detectors.progressT", descKey: "detectors.progressD" },
  { key: "cost", icon: Scale, titleKey: "detectors.costT", descKey: "detectors.costD" },
  { key: "duplicate", icon: CopyCheck, titleKey: "detectors.duplicateT", descKey: "detectors.duplicateD" },
  { key: "delay", icon: Timer, titleKey: "detectors.delayT", descKey: "detectors.delayD" },
  { key: "evidence", icon: ImageOff, titleKey: "detectors.evidenceT", descKey: "detectors.evidenceD" },
  { key: "agency", icon: Building2, titleKey: "detectors.agencyT", descKey: "detectors.agencyD" },
  { key: "geospatial", icon: MapPinned, titleKey: "detectors.geospatialT", descKey: "detectors.geospatialD" },
  { key: "march", icon: CalendarClock, titleKey: "detectors.marchT", descKey: "detectors.marchD", ours: true },
];

export function AIModules() {
  const { t } = useI18n();
  const [active, setActive] = useState<DetectorKey | null>(null);
  const activeModule = MODULES.find((m) => m.key === active);

  return (
    <section id="ai-intelligence" className="scroll-mt-20 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent-2">
            {t("detectors.eyebrow")}
          </p>
          <h2 className="mx-auto mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
            {t("detectors.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted">
            {t("detectors.body")}
          </p>
        </Reveal>

        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((m) => (
            <StaggerItem key={m.key}>
              <div
                className={`plate plate-raised group flex h-full flex-col p-5 ${
                  m.ours ? "ring-1 ring-accent/40" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="h-14 w-14 overflow-hidden rounded-xl ring-1 ring-border transition-transform group-hover:scale-110">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/images/detectors/${m.key}.png`}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  {m.ours && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent-2 ring-1 ring-accent/30">
                      <Sparkles className="h-3 w-3" /> {t("detectors.oursBadge")}
                    </span>
                  )}
                </div>
                <h3 className="mt-4 font-display text-base font-semibold text-fg">
                  {t(m.titleKey)}
                </h3>
                <p className="mt-1.5 flex-1 text-xs leading-relaxed text-muted">
                  {t(m.descKey)}
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-4 w-full"
                  onClick={() => setActive(m.key)}
                >
                  <FlaskConical className="h-3.5 w-3.5" /> {t("actions.testDetector")}
                </Button>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      <AnimatePresence>
        {activeModule && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={() => setActive(null)}
            />
            <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 20 }}
                transition={{ duration: 0.2 }}
                className="pointer-events-auto w-full max-w-lg"
                role="dialog"
                aria-label={`${t(activeModule.titleKey)} detector demo`}
              >
                <div className="overflow-hidden rounded-2xl plate shadow-2xl">
                  <div className="flex items-center justify-between border-b border-border p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded-lg ring-1 ring-border">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`/images/detectors/${activeModule.key}.png`}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-display text-sm font-bold text-fg">
                          {t(activeModule.titleKey)}
                        </div>
                        <div className="text-[11px] text-faint">
                          {t("actions.testDetector")} · demo
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setActive(null)}
                      className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-surface-2"
                      aria-label="Close"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="p-5">
                    <DetectorDemo detector={activeModule.key} />
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
