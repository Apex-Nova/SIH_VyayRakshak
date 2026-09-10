import type { Metadata, Viewport } from "next";
import { Inter, IBM_Plex_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/layout/site-chrome";
import { I18nProvider } from "@/lib/i18n/provider";
import { getLocale } from "@/lib/i18n/server";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vyayrakshak.example"),
  title: {
    default: "VyayRakshak — MPLADS Risk Intelligence",
    template: "%s · VyayRakshak",
  },
  description:
    "A read-only AI analytics layer on top of MPLADS/eSAKSHI that detects anomalies, waste and irregularities across development works — with an explainable 0–100 risk score. SIH prototype (SIH26102).",
  keywords: [
    "MPLADS",
    "VyayRakshak",
    "eSAKSHI",
    "risk intelligence",
    "anomaly detection",
    "GovTech",
    "decision support",
    "public fund monitoring",
  ],
  openGraph: {
    title: "VyayRakshak — MPLADS Risk Intelligence",
    description:
      "A read-only AI analytics layer on MPLADS/eSAKSHI: explainable anomaly and fraud-risk detection for development works.",
    type: "website",
    images: [{ url: "/images/og.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "VyayRakshak — MPLADS Risk Intelligence",
    images: ["/images/og.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f3ecd9",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = getLocale();
  return (
    <html
      lang={locale}
      className={`${inter.variable} ${fraunces.variable} ${plexMono.variable}`}
    >
      <body className="min-h-screen antialiased">
        <I18nProvider initialLocale={locale}>
          <SiteChrome>{children}</SiteChrome>
        </I18nProvider>
      </body>
    </html>
  );
}
