import type { MetadataRoute } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing, type AppHref, type StaticPath } from "@/i18n/routing";
import { canonicalServiceSlug, detailServiceIds } from "@/config/services";
import type { Locale } from "@/i18n/locales";
import { getSiteUrl } from "@/lib/site-url";

const updated = new Date("2026-11-11T00:00:00.000Z");

const staticPaths: StaticPath[] = [
  "/",
  "/treatments",
  "/bridal",
  "/portfolio",
  "/about",
  "/booking",
  "/contact",
  "/privacy",
  "/cookies",
];

function languages(href: AppHref) {
  return Object.fromEntries(
    routing.locales.map((locale) => [locale, `${getSiteUrl()}${getPathname({ locale, href })}`]),
  );
}

export default function sitemap(): MetadataRoute.Sitemap {
  const site = getSiteUrl();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${site}${getPathname({ locale, href: path })}`,
        lastModified: updated,
        changeFrequency: path === "/" ? "weekly" : "monthly",
        priority: path === "/" ? 1 : 0.7,
        alternates: { languages: languages(path) },
      });
    }

    for (const id of detailServiceIds) {
      const href: AppHref = {
        pathname: "/treatments/[service]",
        params: { service: canonicalServiceSlug(id, locale as Locale) },
      };
      entries.push({
        url: `${site}${getPathname({ locale, href })}`,
        lastModified: updated,
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((item) => [
              item,
              `${site}${getPathname({
                locale: item,
                href: {
                  pathname: "/treatments/[service]",
                  params: { service: canonicalServiceSlug(id, item as Locale) },
                },
              })}`,
            ]),
          ),
        },
      });
    }
  }

  return entries;
}
