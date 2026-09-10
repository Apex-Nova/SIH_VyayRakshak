"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { formatIndianNumber } from "@/lib/utils";

/** Serializable formatting kinds so server components can drive the counter
 *  without passing a function across the client boundary. */
export type CounterKind = "number" | "rupee";

function formatKind(n: number, kind: CounterKind): string {
  const rounded = formatIndianNumber(n);
  return kind === "rupee" ? `₹${rounded}` : rounded;
}

export function AnimatedCounter({
  value,
  duration = 1600,
  format,
  kind = "number",
  className,
  prefix = "",
  suffix = "",
}: {
  value: number;
  duration?: number;
  format?: (n: number) => string;
  kind?: CounterKind;
  className?: string;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration, reduce]);

  const text = format ? format(display) : formatKind(display, kind);
  return (
    <span ref={ref} className={className}>
      {prefix}
      {text}
      {suffix}
    </span>
  );
}
