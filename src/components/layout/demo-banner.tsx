"use client";

import { useState } from "react";
import { Info, X } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";

export function DemoBanner() {
  const { t } = useI18n();
  const [show, setShow] = useState(true);
  if (!show) return null;
  return (
    <div className="relative z-50 flex items-center justify-center gap-2 bg-accent/10 px-8 py-1.5 text-center text-[11px] font-medium text-accent-2 ring-1 ring-inset ring-accent/25">
      <Info className="h-3.5 w-3.5 shrink-0" />
      <span>{t("demo.banner")}</span>
      <button
        onClick={() => setShow(false)}
        className="absolute right-3 text-accent-2/70 hover:text-accent-2"
        aria-label="Dismiss"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
