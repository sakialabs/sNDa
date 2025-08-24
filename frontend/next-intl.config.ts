import {notFound} from "next/navigation";

export const locales = ["en", "ar"] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = "en";

const config = {
  locales: Array.from(locales),
  defaultLocale,
  localePrefix: "always"
};

export default config;

export function assertLocale(locale: string): asserts locale is Locale {
  if (!locales.includes(locale as Locale)) notFound();
}
