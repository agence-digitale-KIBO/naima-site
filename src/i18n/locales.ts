export const locales = ["it", "fr", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "it";

export function isLocale(value: string): value is Locale {
  return locales.some((locale) => locale === value);
}
