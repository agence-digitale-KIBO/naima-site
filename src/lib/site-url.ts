export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;

  return "http://localhost:3000";
}

/** Stay out of Google until the domain, legal pages and address are confirmed. */
export function isIndexable(): boolean {
  return process.env.NEXT_PUBLIC_SITE_INDEXABLE === "true";
}
