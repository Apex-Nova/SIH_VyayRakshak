"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "@/components/ui/reveal";
import {
  Database,
  Brain,
  AlertTriangle,
  Gauge,
  FileSearch,
  Crosshair,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";

const STEPS = [
  { n: "01", icon: Database, tk: "process.s1", dk: "process.s1d" },
  { n: "02", icon: Brain, tk: "process.s2", dk: "process.s2d" },
  { n: "03", icon: AlertTriangle, tk: "process.s3", dk: "process.s3d" },
  { n: "04", icon: Gauge, tk: "process.s4", dk: "process.s4d" },
  { n: "05", icon: FileSearch, tk: "process.s5", dk: "process.s5d" },
  { n: "06", icon: Crosshair, tk: "process.s6", dk: "process.s6d" },
];

export function Process() {
  const { t } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.4"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="process" className="scroll-mt-20 border-y border-border bg-surface/40 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent-2">
            {t("process.eyebrow")}
          </p>
          <h2 className="mx-auto mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
            {t("process.title")}
          </h2>
        </Reveal>

        <Reveal delay={0.08}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/process-flow.jpg"
            alt="Records passing through an inspection lens into a 0–100 risk gauge"
            className="mx-auto mt-10 w-full max-w-3xl rounded-2xl plate"
            loading="lazy"
          />
        </Reveal>

        <div ref={ref} className="relative mt-14">
          <div className="absolute left-0 top-9 hidden h-0.5 w-full bg-border lg:block">
            <motion.div
              style={{ scaleX: lineScale, transformOrigin: "left" }}
              className="h-full bg-gradient-to-r from-accent to-accent-2"
            />
          </div>

          <div className="grid gap-8 lg:grid-cols-6">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative"
              >
                <div className="plate relative z-10 flex h-[72px] w-[72px] items-center justify-center rounded-2xl">
                  <s.icon className="h-6 w-6 text-accent-2" />
                  <span className="absolute -right-1 -top-1 rounded-md bg-accent px-1.5 py-0.5 font-mono text-[10px] font-bold text-on-accent">
                    {s.n}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-sm font-semibold tracking-wide text-fg">
                  {t(s.tk)}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">{t(s.dk)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
