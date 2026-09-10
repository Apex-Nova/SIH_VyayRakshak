import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format Indian Rupee amounts in a compact, readable way. */
export function formatINR(amount: number, opts?: { compact?: boolean }): string {
  if (opts?.compact) {
    if (amount >= 1e7) return `₹${(amount / 1e7).toFixed(2)} Cr`;
    if (amount >= 1e5) return `₹${(amount / 1e5).toFixed(2)} L`;
    if (amount >= 1e3) return `₹${(amount / 1e3).toFixed(1)}K`;
    return `₹${amount.toFixed(0)}`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Indian-grouping number format, e.g. 2,18,913 */
export function formatIndianNumber(n: number): string {
  return new Intl.NumberFormat("en-IN").format(Math.round(n));
}

export function formatDate(d: Date | string | null | undefined): string {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

export function pct(value: number, total: number): number {
  if (!total) return 0;
  return clamp((value / total) * 100, 0, 999);
}

/** Deterministic seeded PRNG (mulberry32) so demo data is stable across renders. */
export function seededRandom(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pick<T>(rand: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
