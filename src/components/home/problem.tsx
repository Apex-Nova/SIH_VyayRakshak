import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { FileText, Wallet, GanttChartSquare, Images } from "lucide-react";
import { getT } from "@/lib/i18n/server";

const CARDS = [
  {
    icon: FileText,
    titleKey: "problem.c1t",
    subKey: "problem.c1s",
    items: [
      "Sanction orders & administrative approvals",
      "District & constituency tagging",
      "Implementing-agency registration",
      "Sector classification & scope",
      "Work status",
    ],
  },
  {
    icon: Wallet,
    titleKey: "problem.c2t",
    subKey: "problem.c2s",
    items: [
      "Sanctioned cost vs installment releases",
      "Vendor payments & voucher breakdowns",
      "Unspent balance & interest tracking",
      "Utilisation-certificate (UC) alignment",
      "March-concentrated spend",
    ],
  },
  {
    icon: GanttChartSquare,
    titleKey: "problem.c3t",
    subKey: "problem.c3s",
    items: [
      "Start dates, milestones & expected completion",
      "Reported physical completion %",
      "Historical delay metrics & extensions",
      "Site-inspection frequency & status logs",
    ],
  },
  {
    icon: Images,
    titleKey: "problem.c4t",
    subKey: "problem.c4s",
    items: [
      "Geotagged site photos & work logs",
      "Measurement books (MB) & completion reports",
      "Contractor agreements & technical sanctions",
      "Audit queries & public grievance reports",
    ],
  },
];

export function Problem() {
  const { t } = getT();
  return (
    <section id="problem" className="scroll-mt-20 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-8 lg:grid-cols-[1.3fr_1fr]">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-wider text-accent-2">
              {t("problem.eyebrow")}
            </p>
            <h2 className="mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
              {t("problem.title")}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
              {t("problem.body")}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/problem-desk.jpg"
              alt="Audit desk with ledgers, magnifier and rupee coins"
              className="mx-auto w-full max-w-sm rounded-2xl"
              loading="lazy"
            />
          </Reveal>
        </div>

        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((c) => (
            <StaggerItem key={c.titleKey}>
              <div className="plate plate-raised group h-full p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent/12 ring-1 ring-accent/30 transition-colors group-hover:bg-accent/20">
                  <c.icon className="h-5 w-5 text-accent-2" />
                </div>
                <h3 className="mt-4 font-display text-base font-semibold tracking-wide text-fg">
                  {t(c.titleKey)}
                </h3>
                <p className="text-xs text-faint">{t(c.subKey)}</p>
                <ul className="mt-4 space-y-1.5">
                  {c.items.map((it) => (
                    <li key={it} className="flex items-start gap-2 text-xs text-muted">
                      <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-accent" />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
