"use client";

import { useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { openingHours, weekdays, type Interval } from "@/config/opening-hours";
import { formatTime, intervalsOn } from "@/lib/opening-status";
import { useOpeningSnapshot } from "@/components/use-opening-clock";

export function OpeningHours() {
  const t = useTranslations("hours");
  const locale = useLocale();
  const snapshot = useOpeningSnapshot();
  const today = snapshot?.clock.weekday ?? null;

  useEffect(() => {
    if (window.location.hash !== "#orari") return;
    const row = document.getElementById("orario-oggi");
    if (!row) return;
    row.classList.add("hours-focus");
    const timeout = window.setTimeout(() => row.classList.remove("hours-focus"), 2400);
    return () => window.clearTimeout(timeout);
  }, [today]);

  return (
    <section id="orari" aria-labelledby="orari-title">
      <p className="eyebrow text-muted">{t("eyebrow")}</p>
      <h2 id="orari-title" className="display mt-4 max-w-[12ch] text-5xl md:text-6xl">
        {t("sectionTitle")}
      </h2>
      <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">{t("sectionLead")}</p>
      {openingHours.confirmed ? null : (
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">{t("draft")}</p>
      )}
      <ol className="mt-8 border-t border-sand">
        {weekdays.map((day) => {
          const current = day === today;
          const shown: readonly Interval[] =
            current && snapshot ? intervalsOn(snapshot.clock.isoDate, openingHours) : openingHours.weekly[day];

          return (
            <li
              key={day}
              id={current ? "orario-oggi" : undefined}
              aria-current={current ? "date" : undefined}
              className={`flex flex-col gap-2 border-b border-sand py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 ${
                current ? "hours-today" : ""
              }`}
            >
              <span className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-serif text-3xl capitalize">{t(`days.${day}`)}</span>
                {current ? <span className="eyebrow text-muted">{t("today")}</span> : null}
              </span>
              {shown.length === 0 ? (
                <span className="text-sm text-muted sm:text-right">{t("closed")}</span>
              ) : (
                <span className="flex min-w-0 flex-wrap gap-x-3 gap-y-1 sm:justify-end">
                  {shown.map(([start, end]) => (
                    <span key={`${day}-${start}`} className="whitespace-nowrap text-sm">
                      {formatTime(start, locale)}–{formatTime(end, locale)}
                    </span>
                  ))}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
