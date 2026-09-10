"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, X, ShieldCheck, Search, Languages } from "lucide-react";
import { NAV_GROUPS } from "@/lib/nav";
import { ButtonLink } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { t, locale, toggle } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobile(false), [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border bg-bg/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
      onMouseLeave={() => setOpen(null)}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent/15 ring-1 ring-accent/40">
            <ShieldCheck className="h-5 w-5 text-accent" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-base font-bold tracking-tight text-fg">
              {t("brand.name")}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-faint">
              {t("brand.tagline")}
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_GROUPS.map((group) => (
            <div
              key={group.key}
              className="relative"
              onMouseEnter={() => setOpen(group.key)}
            >
              <button
                className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-fg"
                aria-expanded={open === group.key}
              >
                {t(group.key)}
                <ChevronDown className="h-3.5 w-3.5 opacity-70" />
              </button>
              <AnimatePresence>
                {open === group.key && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.16 }}
                    className="absolute left-0 top-full w-64 pt-2"
                  >
                    <div className="overflow-hidden rounded-xl plate p-1.5">
                      {group.links.map((l) => (
                        <Link
                          key={l.href}
                          href={l.href}
                          className="block rounded-lg px-3 py-2 text-sm font-medium text-fg transition-colors hover:bg-surface-2"
                        >
                          {t(l.key)}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden items-center gap-2 lg:flex">
          <button
            onClick={toggle}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-muted ring-1 ring-border transition-colors hover:text-fg hover:bg-surface-2"
            aria-label="Toggle language"
          >
            <Languages className="h-4 w-4" />
            {locale === "en" ? "हिंदी" : "EN"}
          </button>
          <Link
            href="/projects"
            className="grid h-9 w-9 place-items-center rounded-lg text-muted ring-1 ring-border transition-colors hover:bg-surface-2 hover:text-fg"
            aria-label="Search works"
          >
            <Search className="h-4 w-4" />
          </Link>
          <ButtonLink href="/login" variant="secondary" size="sm">
            {t("actions.login")}
          </ButtonLink>
          <ButtonLink href="/dashboard" size="sm" className="btn-3d">
            {t("actions.exploreDashboard")}
          </ButtonLink>
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={toggle}
            className="grid h-10 items-center rounded-lg px-2.5 text-xs font-semibold text-fg ring-1 ring-border"
            aria-label="Toggle language"
          >
            {locale === "en" ? "हिं" : "EN"}
          </button>
          <button
            className="grid h-10 w-10 place-items-center rounded-lg text-fg ring-1 ring-border"
            onClick={() => setMobile((m) => !m)}
            aria-label="Toggle navigation"
          >
            {mobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobile && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-border bg-bg/95 backdrop-blur-xl lg:hidden"
          >
            <div className="max-h-[70vh] space-y-4 overflow-y-auto px-4 py-5 scroll-thin">
              {NAV_GROUPS.map((group) => (
                <div key={group.key}>
                  <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-faint">
                    {t(group.key)}
                  </div>
                  <div className="grid grid-cols-1 gap-0.5">
                    {group.links.map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        className="rounded-lg px-3 py-2 text-sm text-fg hover:bg-surface-2"
                      >
                        {t(l.key)}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <ButtonLink href="/login" variant="secondary" size="sm">
                  {t("actions.login")}
                </ButtonLink>
                <ButtonLink href="/report" variant="outline" size="sm">
                  {t("actions.report")}
                </ButtonLink>
                <ButtonLink href="/dashboard" size="sm" className="col-span-2 btn-3d">
                  {t("actions.exploreDashboard")}
                </ButtonLink>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
