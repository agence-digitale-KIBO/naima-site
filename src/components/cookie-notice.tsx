"use client";

import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const storageKey = "naima-cookie-notice";
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function dismissed() {
  return window.localStorage.getItem(storageKey) === "dismissed";
}

function dismissNotice() {
  window.localStorage.setItem(storageKey, "dismissed");
  listeners.forEach((listener) => listener());
}

export function CookieNotice() {
  const t = useTranslations("cookieNotice");
  const hidden = useSyncExternalStore(subscribe, dismissed, () => true);

  if (hidden) return null;

  return (
    <div className="border-b border-sand bg-[#f3efe9]">
      <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-3 px-5 py-3 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>
          {t("text")}{" "}
          <Link href="/cookies" className="underline underline-offset-4">
            {t("more")}
          </Link>
        </p>
        <button
          type="button"
          className="inline-flex min-h-11 items-center justify-center px-3 text-[0.72rem] tracking-[0.14em] uppercase text-ink"
          onClick={dismissNotice}
        >
          {t("action")}
        </button>
      </div>
    </div>
  );
}
