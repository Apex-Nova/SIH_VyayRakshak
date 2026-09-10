import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumb,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumb?: { label: string; href: string }[];
  action?: React.ReactNode;
}) {
  return (
    <div className="border-b border-border bg-surface/40">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {breadcrumb && (
          <nav className="mb-3 flex items-center gap-1.5 text-xs text-faint">
            {breadcrumb.map((b, i) => (
              <span key={b.href} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="h-3 w-3" />}
                <Link href={b.href} className="hover:text-muted">
                  {b.label}
                </Link>
              </span>
            ))}
          </nav>
        )}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            {eyebrow && (
              <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                {eyebrow}
              </p>
            )}
            <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-fg sm:text-3xl">
              {title}
            </h1>
            {description && (
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                {description}
              </p>
            )}
          </div>
          {action}
        </div>
      </div>
    </div>
  );
}
