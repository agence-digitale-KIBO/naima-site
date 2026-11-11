import type { MetadataRoute } from "next";
import { getSiteUrl, isIndexable } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const indexable = isIndexable();

  return {
    rules: {
      userAgent: "*",
      allow: indexable ? "/" : undefined,
      disallow: indexable ? undefined : "/",
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
