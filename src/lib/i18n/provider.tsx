"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  DEFAULT_LOCALE,
  LOCALES,
  resolve,
  type Locale,
} from "./dictionary";

const LANG_COOKIE = "vr_lang";

interface I18nCtx {
  locale: Locale;
  t: (key: string) => string;
  setLocale: (l: Locale) => void;
  toggle: () => void;
}

const Ctx = createContext<I18nCtx | null>(null);

function readCookieLocale(): Locale {
  if (typeof document === "undefined") return DEFAULT_LOCALE;
  const m = document.cookie.match(/(?:^|; )vr_lang=([^;]+)/);
  const v = m?.[1] as Locale | undefined;
  return v && LOCALES.includes(v) ? v : DEFAULT_LOCALE;
}

export function I18nProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>(initialLocale ?? DEFAULT_LOCALE);

  // Sync from cookie on mount (covers client-only navigations).
  useEffect(() => {
    const c = readCookieLocale();
    if (c !== locale) setLocaleState(c);
    document.documentElement.lang = c;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLocale = useCallback(
    (l: Locale) => {
      document.cookie = `${LANG_COOKIE}=${l};path=/;max-age=31536000;samesite=lax`;
      document.documentElement.lang = l;
      setLocaleState(l);
      // Refresh server components so their getT() picks up the new cookie.
      router.refresh();
    },
    [router]
  );

  const toggle = useCallback(
    () => setLocale(locale === "en" ? "hi" : "en"),
    [locale, setLocale]
  );

  const t = useCallback((key: string) => resolve(locale, key), [locale]);

  return (
    <Ctx.Provider value={{ locale, t, setLocale, toggle }}>{children}</Ctx.Provider>
  );
}

export function useI18n(): I18nCtx {
  const ctx = useContext(Ctx);
  if (!ctx) {
    // Safe fallback so components never crash outside the provider.
    return {
      locale: DEFAULT_LOCALE,
      t: (k) => resolve(DEFAULT_LOCALE, k),
      setLocale: () => {},
      toggle: () => {},
    };
  }
  return ctx;
}
