import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageIntro } from "@/components/page-intro";
import { ServiceIndex } from "@/components/service-index";
import { Shell } from "@/components/shell";
import { assertLocale } from "@/lib/locale";
import { pageMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "/treatments", "meta.treatments");
}

export default async function TreatmentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = assertLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "services" });

  return (
    <>
      <PageIntro eyebrow={t("indexEyebrow")} title={t("indexTitle")}>
        <p>{t("indexLead")}</p>
      </PageIntro>
      <Shell className="py-14 md:py-20">
        <ServiceIndex locale={locale} detailed />
      </Shell>
    </>
  );
}
