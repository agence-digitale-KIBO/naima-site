import { site } from "@/config/site";
import { getSiteUrl } from "@/lib/site-url";

/**
 * Only verified facts. No geo coordinates, opening hours, prices or ratings
 * until Naima confirms them.
 */
export function beautySalonSchema(description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: site.name,
    description,
    url: getSiteUrl(),
    telephone: site.phoneE164,
    email: site.email,
    foundingDate: site.founded,
    founder: {
      "@type": "Person",
      name: site.founder,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: site.street,
      addressCountry: site.countryCode,
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Provincia di Messina",
    },
    sameAs: [site.instagram.studio, site.instagram.makeup],
  };
}

export function serviceSchema(name: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType: name,
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Provincia di Messina",
    },
    provider: {
      "@type": "BeautySalon",
      name: site.name,
      telephone: site.phoneE164,
      email: site.email,
    },
  };
}
