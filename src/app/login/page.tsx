import type { Metadata } from "next";
import { LoginPanel } from "@/components/auth/login-panel";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = { title: "Login" };

export default function LoginPage() {
  return (
    <div className="relative flex min-h-[calc(100vh-8rem)] items-center justify-center overflow-hidden px-4 py-16">
      <div className="absolute inset-0 bg-grid bg-grid-fade opacity-50" aria-hidden />
      <div className="absolute inset-0 bg-radial-accent" aria-hidden />
      <div className="relative w-full max-w-md">
        <Link href="/" className="mb-6 flex items-center justify-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent/15 ring-1 ring-accent/40">
            <ShieldAlert className="h-5 w-5 text-accent" />
          </span>
          <span className="text-lg font-bold text-fg">
            NIRIKSHAK <span className="text-accent">AI</span>
          </span>
        </Link>
        <LoginPanel />
      </div>
    </div>
  );
}
