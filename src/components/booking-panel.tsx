"use client";

import dynamic from "next/dynamic";
import { useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import type { ServiceId } from "@/config/services";
import { Button } from "@/components/button";

const CalEmbed = dynamic(() => import("@/components/cal-embed").then((mod) => mod.CalEmbed), {
  ssr: false,
});

export type BookingOption = {
  id: ServiceId;
  label: string;
  calLink: string | null;
  calUrl: string | null;
  whatsappUrl: string;
};

function subscribeToQuery(onStoreChange: () => void) {
  window.addEventListener("popstate", onStoreChange);
  return () => window.removeEventListener("popstate", onStoreChange);
}

function requestedService() {
  return new URLSearchParams(window.location.search).get("service") ?? "";
}

export function BookingPanel({ options }: { options: BookingOption[] }) {
  const t = useTranslations("booking");
  const requested = useSyncExternalStore(subscribeToQuery, requestedService, () => "");
  const queryChoice = options.some((option) => option.id === requested) ? (requested as ServiceId) : null;
  const [chosen, setChosen] = useState<ServiceId | null>(null);
  const selected = chosen ?? queryChoice ?? options[0]?.id ?? "nails";
  const [consent, setConsent] = useState(false);
  const [showEmbed, setShowEmbed] = useState(false);

  const current = options.find((option) => option.id === selected) ?? options[0];
  if (!current) return null;

  return (
    <div>
      <div role="radiogroup" aria-label={t("choose")} className="grid gap-2">
        {options.map((option) => {
          const active = option.id === current.id;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => {
                setChosen(option.id);
                setShowEmbed(false);
              }}
              className={`min-h-12 border-b px-1 py-3 text-left font-serif text-2xl ${
                active ? "border-ink text-ink" : "border-sand text-muted"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <div className="mt-10 max-w-xl">
        {current.calUrl ? (
          <>
            <p className="text-lg leading-relaxed text-muted">{t("configuredLead")}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">{t("timezone")}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button externalHref={current.calUrl} tone="solid">
                {t("openExternal")}
              </Button>
              <Button externalHref={current.whatsappUrl} tone="ghost">
                {t("whatsappInstead")}
              </Button>
            </div>
            <p className="mt-3 text-xs text-muted">{t("externalNote")}</p>
            {!showEmbed ? (
              <button
                type="button"
                className="mt-8 min-h-11 text-left text-sm underline underline-offset-4"
                onClick={() => setShowEmbed(true)}
              >
                {t("showEmbed")}
              </button>
            ) : (
              <label className="mt-8 flex items-start gap-3 text-sm leading-relaxed">
                <input
                  type="checkbox"
                  className="mt-1 size-4"
                  checked={consent}
                  onChange={(event) => setConsent(event.target.checked)}
                />
                <span>{t("consent")}</span>
              </label>
            )}
            {showEmbed && consent ? (
              <div className="mt-6 min-h-[680px] border border-sand">
                <CalEmbed calLink={current.calLink ?? ""} />
              </div>
            ) : null}
          </>
        ) : (
          <>
            <p className="font-serif text-3xl leading-tight">{t("pending")}</p>
            <p className="mt-4 text-lg leading-relaxed text-muted">{t("pendingDetail")}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">{t("timezone")}</p>
            <div className="mt-8">
              <Button externalHref={current.whatsappUrl}>{t("whatsappInstead")}</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
