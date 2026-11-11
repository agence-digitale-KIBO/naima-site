import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import { routing, type AppHref } from "@/i18n/routing";
import { assertLocale } from "@/lib/locale";
import { isIndexable } from "@/lib/site-url";

const openGraphLocale = {
  it: "it_IT",
  fr: "fr_FR",
  en: "en_US",
} as const;

export async function pageMetadata(
  locale: string,
  href: AppHref,
  namespace: string,
): Promise<Metadata> {
  const current = assertLocale(locale);
  const t = await getTranslations({ locale: current, namespace });
  const title = t("title");
  const description = t("description");
  const languages: Record<string, string> = {};

  for (const item of routing.locales) {
    languages[item] = getPathname({ locale: item, href });
  }
  languages["x-default"] = getPathname({ locale: "it", href });

  const canonical = getPathname({ locale: current, href });

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      locale: openGraphLocale[current],
      type: "website",
      siteName: "Naima Studio di Bellezza",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: isIndexable()
      ? { index: true, follow: true }
      : { index: false, follow: false, nocache: true },
  };
}
