import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Shell } from "@/components/shell";
import { defaultLocale, isLocale } from "@/i18n/locales";

export default async function NotFound() {
  const headerStore = await headers();
  const requested = headerStore.get("x-next-intl-locale");
  const locale = requested && isLocale(requested) ? requested : defaultLocale;
  const t = await getTranslations({ locale, namespace: "notFound" });

  return (
    <Shell className="py-24">
      <h1 className="display text-6xl">{t("title")}</h1>
      <p className="mt-6 max-w-md text-lg text-muted">{t("body")}</p>
      <Link href="/" className="mt-8 inline-flex min-h-11 items-center underline underline-offset-4">
        {t("home")}
      </Link>
    </Shell>
  );
}
