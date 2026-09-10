import { cookies } from "next/headers";
import { DEFAULT_LOCALE, LOCALES, resolve, type Locale } from "./dictionary";

export const LANG_COOKIE = "vr_lang";

/** Read the active locale from the request cookie (server components). */
export function getLocale(): Locale {
  const c = cookies().get(LANG_COOKIE)?.value as Locale | undefined;
  return c && LOCALES.includes(c) ? c : DEFAULT_LOCALE;
}

/** Server-side translator bound to the request locale. */
export function getT() {
  const locale = getLocale();
  const t = (key: string) => resolve(locale, key);
  return { t, locale };
}
