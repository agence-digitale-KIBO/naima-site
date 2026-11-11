import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { isLocale, type Locale } from "@/i18n/locales";

export function assertLocale(locale: string): Locale {
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  return locale;
}
