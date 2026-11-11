"use client";

import type { MouseEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { getPathname } from "@/i18n/navigation";
import { openingHours } from "@/config/opening-hours";
import { formatTime, type OpeningStatus } from "@/lib/opening-status";
import { useOpeningSnapshot } from "@/components/use-opening-clock";

function phrase(status: OpeningStatus, t: (key: string, values?: Record<string, string>) => string, locale: string) {
  const time = (value: string) => formatTime(value, locale);

  if (status.kind === "open") {
    return `${t("open")} · ${t("until", { time: time(status.until) })}`;
  }

  if (status.kind === "break") {
    return `${t("lunch")} · ${t("reopensToday", { time: time(status.until) })}`;
  }

  if (!status.next) return t("unknown");

  const when =
    status.next.relation === "today"
      ? t("reopensToday", { time: time(status.next.time) })
      : status.next.relation === "tomorrow"
        ? t("reopensTomorrow", { time: time(status.next.time) })
        : t("reopensOn", {
            day: t(`days.${status.next.weekday}`),
            time: time(status.next.time),
          });

  return `${status.reason === "day" ? t("closedToday") : t("closedNow")} · ${when}`;
}

function revealHours(section: HTMLElement) {
  const rows = section.querySelectorAll<HTMLElement>("#orario-oggi");
  const row = [...rows].find((item) => item.getClientRects().length > 0);
  const target = row ?? section;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  target.classList.remove("hours-focus");
  window.requestAnimationFrame(() => target.classList.add("hours-focus"));
  window.setTimeout(() => target.classList.remove("hours-focus"), 2400);
  const next = `${window.location.pathname}${window.location.search}#orari`;
  window.history.replaceState(null, "", next);
}

function visibleHours() {
  const sections = document.querySelectorAll<HTMLElement>("#orari");
  for (const section of sections) {
    if (section.getClientRects().length > 0) return section;
  }
  return null;
}

export function OpeningStatusBanner() {
  const t = useTranslations("hours");
  const locale = useLocale();
  const snapshot = useOpeningSnapshot();
  const href = `${getPathname({ locale, href: "/contact" })}#orari`;
  const statusText = snapshot ? phrase(snapshot.status, t, locale) : t("pending");
  const text = openingHours.confirmed ? statusText : `${t("draftMark")} · ${statusText}`;

  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    const section = visibleHours();
    if (!section) return;
    event.preventDefault();
    revealHours(section);
  }

  return (
    <a
      href={href}
      onClick={onClick}
      className="opening-banner"
      aria-label={`${text}. ${t("bannerLabel")}`}
    >
      <span
        aria-hidden="true"
        className={`opening-dot ${snapshot?.status.kind === "open" ? "is-open" : ""}`}
      />
      <span className="min-w-0">{text}</span>
    </a>
  );
}
