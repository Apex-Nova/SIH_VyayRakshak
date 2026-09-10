"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Search,
  ClipboardCheck,
  BarChart3,
  Building2,
  User,
  Loader2,
} from "lucide-react";
import type { Role } from "@/lib/types";

const ROLES: {
  role: Role;
  label: string;
  icon: typeof ShieldCheck;
  desc: string;
  route: string;
}[] = [
  { role: "ADMIN", label: "Demo Admin", icon: ShieldCheck, desc: "Full platform oversight", route: "/dashboard" },
  { role: "AUDITOR", label: "Demo Auditor", icon: Search, desc: "Investigation & audit", route: "/investigation" },
  { role: "FIELD_INSPECTOR", label: "Demo Inspector", icon: ClipboardCheck, desc: "Field verification mode", route: "/inspection" },
  { role: "ANALYST", label: "Demo Analyst", icon: BarChart3, desc: "Dashboards & explorer", route: "/dashboard" },
  { role: "DISTRICT_AUTHORITY", label: "District Authority", icon: Building2, desc: "District-level review", route: "/map" },
  { role: "CITIZEN", label: "Citizen", icon: User, desc: "Report & explore", route: "/report" },
];

export function LoginPanel() {
  const router = useRouter();
  const [loading, setLoading] = useState<Role | null>(null);

  function login(role: Role, route: string) {
    setLoading(role);
    try {
      localStorage.setItem("nirikshak_demo_role", role);
    } catch {
      /* storage may be unavailable */
    }
    setTimeout(() => router.push(route), 500);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-surface/90 p-6 backdrop-blur-xl"
    >
      <h1 className="text-center text-xl font-bold text-fg">Sign in to continue</h1>
      <p className="mt-1 text-center text-sm text-muted">
        Choose a demo role. No password required for the prototype.
      </p>

      <div className="mt-6 grid gap-2.5">
        {ROLES.map((r) => (
          <button
            key={r.role}
            onClick={() => login(r.role, r.route)}
            disabled={!!loading}
            className="group flex items-center gap-3 rounded-xl border border-border bg-surface-2/40 p-3 text-left transition-colors hover:border-accent/40 hover:bg-surface-2 disabled:opacity-60"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 ring-1 ring-accent/30">
              {loading === r.role ? (
                <Loader2 className="h-5 w-5 animate-spin text-accent" />
              ) : (
                <r.icon className="h-5 w-5 text-accent" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-fg">{r.label}</div>
              <div className="text-xs text-faint">{r.desc}</div>
            </div>
            <span className="rounded-md bg-surface px-2 py-0.5 font-mono text-[10px] uppercase text-faint ring-1 ring-border">
              {r.role.replace("_", " ")}
            </span>
          </button>
        ))}
      </div>

      <p className="mt-5 text-center text-[11px] text-faint">
        Role-based access is illustrative. This SIH102 prototype uses no real
        credentials or personal data.
      </p>
    </motion.div>
  );
}
