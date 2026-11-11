import type { Locale } from "@/i18n/locales";

export type Review = {
  id: string;
  name: string;
  source?: string;
  text: Record<Locale, string>;
};

/** Authentic reviews only. An empty list hides the section. */
export const reviews: Review[] = [];
