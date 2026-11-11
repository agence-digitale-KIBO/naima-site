import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { BookingPanel, type BookingOption } from "@/components/booking-panel";
import { PageIntro } from "@/components/page-intro";
import { Shell } from "@/components/shell";
import { getCalLink, getCalUrl } from "@/config/booking";
import { serviceIds } from "@/config/services";
import { assertLocale } from "@/lib/locale";
import { pageMetadata } from "@/lib/metadata";
import { whatsappUrl } from "@/lib/whatsapp";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "/booking", "meta.booking");
}

export default async function BookingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = assertLocale((await params).locale);
  const t = await getTranslations({ locale });
  const options: BookingOption[] = serviceIds.map((id) => ({
    id,
    label: t(`services.${id}.title`),
    calLink: getCalLink(id),
    calUrl: getCalUrl(id),
    whatsappUrl: whatsappUrl(t(`whatsapp.${id}`)),
  }));

  return (
    <>
      <PageIntro eyebrow={t("booking.eyebrow")} title={t("booking.title")}>
        <p>{t("booking.lead")}</p>
      </PageIntro>
      <Shell className="py-14 md:py-20">
        <BookingPanel options={options} />
      </Shell>
    </>
  );
}
