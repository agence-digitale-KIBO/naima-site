import type { Locale } from "@/i18n/locales";

export const serviceIds = ["nails", "lashes", "makeup", "laser", "headSpa"] as const;

export type ServiceId = (typeof serviceIds)[number];

export const detailServiceIds = ["nails", "lashes", "laser", "headSpa"] as const;

export type DetailServiceId = (typeof detailServiceIds)[number];

type Slugs = Record<Locale, string>;

export const services: Record<
  ServiceId,
  { offerings: readonly string[]; slugs?: Slugs }
> = {
  nails: {
    slugs: {
      it: "unghie-mani-piedi",
      fr: "ongles-mains-pieds",
      en: "nails-hands-feet",
    },
    offerings: ["manicure", "pedicure", "care"],
  },
  lashes: {
    slugs: {
      it: "ciglia-sguardo",
      fr: "cils-regard",
      en: "lashes-eyes",
    },
    offerings: ["lamination", "extensions"],
  },
  makeup: {
    offerings: ["bride", "events", "shoots"],
  },
  laser: {
    slugs: {
      it: "epilazione-laser",
      fr: "epilation-laser",
      en: "laser-hair-removal",
    },
    offerings: ["session", "path"],
  },
  headSpa: {
    slugs: {
      it: "head-spa",
      fr: "head-spa",
      en: "head-spa",
    },
    offerings: ["ritual", "scalp"],
  },
};

const slugToService = new Map<string, DetailServiceId>();

for (const id of detailServiceIds) {
  const slugs = services[id].slugs;
  if (!slugs) continue;
  for (const slug of Object.values(slugs)) {
    slugToService.set(slug, id);
  }
}

export function isDetailService(id: ServiceId): id is DetailServiceId {
  return detailServiceIds.some((item) => item === id);
}

export function resolveServiceId(slug: string): DetailServiceId | null {
  return slugToService.get(slug) ?? null;
}

export function canonicalServiceSlug(id: DetailServiceId, locale: Locale): string {
  const slugs = services[id].slugs;
  if (!slugs) throw new Error(`Missing slugs for ${id}`);
  return slugs[locale];
}

export function serviceOfferings(id: ServiceId): readonly string[] {
  return services[id].offerings;
}
