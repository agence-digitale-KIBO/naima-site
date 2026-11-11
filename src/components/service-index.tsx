import { getTranslations } from "next-intl/server";
import { canonicalServiceSlug, isDetailService, serviceIds } from "@/config/services";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/locales";

export async function ServiceIndex({
  locale,
  detailed = false,
}: {
  locale: Locale;
  detailed?: boolean;
}) {
  const t = await getTranslations({ locale });

  return (
    <div>
      {serviceIds.map((id, index) => {
        const href = isDetailService(id)
          ? {
              pathname: "/treatments/[service]" as const,
              params: { service: canonicalServiceSlug(id, locale) },
            }
          : ("/bridal" as const);
        const number = String(index + 1).padStart(2, "0");

        return (
          <Link key={id} href={href} className="service-row group grid gap-3 py-7 md:grid-cols-12 md:items-end md:gap-8 md:py-9">
            <span className="font-serif text-2xl text-taupe md:col-span-1">{number}</span>
            <span className="md:col-span-6">
              <span className="service-title block font-serif text-4xl leading-none md:text-5xl">
                {t(`services.${id}.title`)}
              </span>
            </span>
            <span className="text-sm leading-relaxed text-muted md:col-span-4">
              {t(`services.${id}.summary`)}
              {detailed ? (
                <span className="mt-3 block">{t(`services.${id}.intro`)}</span>
              ) : null}
            </span>
            <span className="eyebrow text-ink md:col-span-1 md:text-right">{t("common.read")}</span>
          </Link>
        );
      })}
    </div>
  );
}
