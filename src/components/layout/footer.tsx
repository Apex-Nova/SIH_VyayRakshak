import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { getT } from "@/lib/i18n/server";

export function Footer() {
  const { t } = getT();

  const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
    {
      title: t("nav.platform"),
      links: [
        { label: t("nav.aiIntelligence"), href: "/#ai-intelligence" },
        { label: t("nav.riskScoring"), href: "/#risk-scoring" },
        { label: t("nav.geospatial"), href: "/map" },
        { label: t("nav.evidence"), href: "/evidence" },
        { label: t("nav.testWork"), href: "/test" },
      ],
    },
    {
      title: t("nav.resources"),
      links: [
        { label: t("nav.problem"), href: "/#problem" },
        { label: t("nav.solution"), href: "/#process" },
        { label: t("nav.dataSourcing"), href: "/data-sourcing" },
        { label: t("nav.faqs"), href: "/#faq" },
        { label: t("nav.dashboard"), href: "/dashboard" },
      ],
    },
    {
      title: t("nav.data"),
      links: [
        { label: t("actions.report"), href: "/report" },
        { label: t("nav.projects"), href: "/projects" },
        { label: t("nav.agencies"), href: "/agencies" },
        { label: t("nav.compare"), href: "/compare" },
      ],
    },
  ];

  return (
    <footer className="border-t border-border bg-surface/50">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent/15 ring-1 ring-accent/40">
                <ShieldCheck className="h-5 w-5 text-accent" />
              </span>
              <div className="leading-none">
                <div className="font-display text-base font-bold text-fg">
                  {t("brand.name")}
                </div>
                <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-faint">
                  {t("brand.tagline")}
                </div>
              </div>
            </div>
            <p className="mt-4 max-w-xs text-sm text-muted">{t("footer.tagline")}</p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-md bg-surface-2 px-2.5 py-1 text-[11px] font-medium text-muted ring-1 ring-border">
              <span className="h-1.5 w-1.5 rounded-full bg-medium" />
              {t("footer.badge")}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <div className="text-xs font-semibold uppercase tracking-wider text-faint">
                {col.title}
              </div>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted transition-colors hover:text-fg"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-border bg-surface/70 p-4 text-xs leading-relaxed text-muted">
          <strong className="text-fg">Disclaimer.</strong> {t("footer.disclaimer")}
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-faint sm:flex-row">
          <span>
            © {new Date().getFullYear()} {t("brand.name")} — Team Synaptix · SIH26102
          </span>
          <div className="flex gap-4">
            <Link href="/#faq" className="hover:text-muted">
              {t("footer.privacy")}
            </Link>
            <Link href="/#faq" className="hover:text-muted">
              {t("footer.terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
