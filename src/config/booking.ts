import { serviceIds, type ServiceId } from "@/config/services";

/**
 * Public Cal.com paths. Empty until Naima's account and event types exist.
 * Direct `process.env.NEXT_PUBLIC_*` reads stay compatible with Next's inlining.
 */
function eventSlug(serviceId: ServiceId): string {
  const value =
    serviceId === "nails"
      ? process.env.NEXT_PUBLIC_CAL_EVENT_NAILS
      : serviceId === "lashes"
        ? process.env.NEXT_PUBLIC_CAL_EVENT_LASHES
        : serviceId === "makeup"
          ? process.env.NEXT_PUBLIC_CAL_EVENT_MAKEUP
          : serviceId === "laser"
            ? process.env.NEXT_PUBLIC_CAL_EVENT_LASER
            : process.env.NEXT_PUBLIC_CAL_EVENT_HEAD_SPA;

  return value?.trim() ?? "";
}

export function calUsername(): string {
  return process.env.NEXT_PUBLIC_CAL_USERNAME?.trim() ?? "";
}

/** `username/event-type`, as expected by the official Cal.com embed. */
export function getCalLink(serviceId: ServiceId): string | null {
  const username = calUsername();
  const event = eventSlug(serviceId);
  if (!username || !event) return null;
  return `${username}/${event}`;
}

export function getCalUrl(serviceId: ServiceId): string | null {
  const link = getCalLink(serviceId);
  return link ? `https://cal.com/${link}` : null;
}

export function hasAnyCalLink(): boolean {
  return serviceIds.some((id) => getCalLink(id) !== null);
}
