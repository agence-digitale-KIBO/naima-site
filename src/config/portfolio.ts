import type { Locale } from "@/i18n/locales";

export const portfolioCategories = ["nails", "lashes", "makeup", "bridal", "headSpa"] as const;

export type PortfolioCategory = (typeof portfolioCategories)[number];

export type PortfolioItem = {
  id: string;
  category: PortfolioCategory;
  src: string;
  width: number;
  height: number;
  alt: Record<Locale, string>;
  /** Only mark images Naima is allowed to publish as before/after. */
  beforeAfter?: boolean;
};

/** Authorized work only. Leave empty until files and consent exist. */
export const portfolio: PortfolioItem[] = [];

export function filterPortfolio(
  items: readonly PortfolioItem[],
  category: PortfolioCategory | "all",
): PortfolioItem[] {
  if (category === "all") return [...items];
  return items.filter((item) => item.category === category);
}
