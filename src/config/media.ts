import type { Locale } from "@/i18n/locales";

/**
 * Real photographs go here once Naima provides them.
 * A null slot renders no image. Never point these at stock photography.
 */
export type MediaAsset = {
  src: string;
  width: number;
  height: number;
  alt: Record<Locale, string>;
};

export const media: {
  hero: MediaAsset | null;
  about: MediaAsset | null;
  bridal: MediaAsset | null;
  headSpa: MediaAsset | null;
  services: Record<"nails" | "lashes" | "makeup" | "laser" | "headSpa", MediaAsset | null>;
} = {
  hero: null,
  about: null,
  bridal: null,
  headSpa: null,
  services: {
    nails: null,
    lashes: null,
    makeup: null,
    laser: null,
    headSpa: null,
  },
};
