import { defineRouting } from "next-intl/routing";
import { defaultLocale, locales } from "./locales";

export const pathnames = {
  "/": "/",
  "/treatments": {
    it: "/trattamenti",
    fr: "/soins",
    en: "/treatments",
  },
  "/treatments/[service]": {
    it: "/trattamenti/[service]",
    fr: "/soins/[service]",
    en: "/treatments/[service]",
  },
  "/bridal": {
    it: "/make-up-sposa",
    fr: "/maquillage-mariee",
    en: "/bridal-makeup",
  },
  "/portfolio": "/portfolio",
  "/about": {
    it: "/chi-sono",
    fr: "/a-propos",
    en: "/about",
  },
  "/booking": {
    it: "/prenotazioni",
    fr: "/reservations",
    en: "/booking",
  },
  "/contact": {
    it: "/contatti",
    fr: "/contact",
    en: "/contact",
  },
  "/privacy": {
    it: "/privacy",
    fr: "/confidentialite",
    en: "/privacy",
  },
  "/cookies": {
    it: "/cookie",
    fr: "/cookies",
    en: "/cookies",
  },
} as const;

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
  // Metadata alternates are set in page metadata. The proxy Link header
  // currently points x-default at an unprefixed path.
  alternateLinks: false,
  pathnames,
});

export type StaticPath = Exclude<keyof typeof pathnames, "/treatments/[service]">;

export type ServiceHref = {
  pathname: "/treatments/[service]";
  params: { service: string };
};

export type AppHref = StaticPath | ServiceHref;
