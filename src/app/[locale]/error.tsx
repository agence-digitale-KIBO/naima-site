"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Shell } from "@/components/shell";

export default function LocaleError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations();

  return (
    <Shell className="py-24">
      <h1 className="display text-6xl">{t("error.title")}</h1>
      <p className="mt-6 max-w-md text-lg text-muted">{t("error.body")}</p>
      <div className="mt-8 flex gap-6">
        <button type="button" className="min-h-11 underline underline-offset-4" onClick={() => reset()}>
          {t("error.retry")}
        </button>
        <Link href="/" className="inline-flex min-h-11 items-center underline underline-offset-4">
          {t("notFound.home")}
        </Link>
      </div>
    </Shell>
  );
}
