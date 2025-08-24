import { cookies } from "next/headers";

export const locales = ["en", "ar"] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = "en";

export async function getLocaleFromCookie(): Promise<Locale> {
  const c = (await cookies()).get("locale")?.value;
  if (c && locales.includes(c as Locale)) return c as Locale;
  return defaultLocale;
}

export function getDir(locale: Locale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}
