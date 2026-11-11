import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/button";
import { JsonLd } from "@/components/json-ld";
import { Shell } from "@/components/shell";
import { media } from "@/config/media";
import {
  canonicalServiceSlug,
  detailServiceIds,
  resolveServiceId,
  serviceOfferings,
} from "@/config/services";
import { redirect } from "@/i18n/navigation";
import { isLocale } from "@/i18n/locales";
import { assertLocale } from "@/lib/locale";
import { pageMetadata } from "@/lib/metadata";
import { serviceSchema } from "@/lib/schema";
import { whatsappUrl } from "@/lib/whatsapp";

export function generateStaticParams({ params }: { params: { locale: string } }) {
  const locale = params.locale;
  if (!isLocale(locale)) return [];
  return detailServiceIds.map((id) => ({
    service: canonicalServiceSlug(id, locale),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; service: string }>;
}): Promise<Metadata> {
  const { locale, service } = await params;
  const id = resolveServiceId(service);
  if (!id || !isLocale(locale)) return {};
  return pageMetadata(
    locale,
    { pathname: "/treatments/[service]", params: { service: canonicalServiceSlug(id, locale) } },
    `meta.${id}`,
  );
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ locale: string; service: string }>;
}) {
  const { locale, service } = await params;
  const current = assertLocale(locale);
  const id = resolveServiceId(service);
  if (!id) notFound();

  const canonical = canonicalServiceSlug(id, current);
  if (service !== canonical) {
    redirect({
      href: { pathname: "/treatments/[service]", params: { service: canonical } },
      locale: current,
    });
  }

  const t = await getTranslations({ locale: current });
  const offerings = serviceOfferings(id);
  const photo = media.services[id];
  const description = t(`services.${id}.intro`);

  return (
    <>
      <JsonLd data={serviceSchema(t(`services.${id}.title`), description)} />
      <header className="border-b border-sand">
        <Shell className="grid gap-10 py-16 md:grid-cols-12 md:py-24">
          <div className="md:col-span-7">
            <p className="eyebrow text-muted">{t("services.indexEyebrow")}</p>
            <h1 className="display mt-5 text-[clamp(3.2rem,8vw,6.2rem)]">{t(`services.${id}.title`)}</h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted">{description}</p>
          </div>
          {photo ? (
            <Image
              src={photo.src}
              alt={photo.alt[current]}
              width={photo.width}
              height={photo.height}
              className="h-auto w-full md:col-span-5"
              priority
            />
          ) : null}
        </Shell>
      </header>
      <Shell className="py-16 md:py-20">
        {t(`services.${id}.body`) ? (
          <p className="max-w-2xl text-lg leading-relaxed">{t(`services.${id}.body`)}</p>
        ) : null}
        <div className="mt-14 max-w-3xl">
          {offerings.map((offering) => (
            <article key={offering} className="border-t border-sand py-8">
              <h2 className="font-serif text-4xl">{t(`services.${id}.offerings.${offering}.title`)}</h2>
              <p className="mt-4 max-w-xl leading-relaxed text-muted">
                {t(`services.${id}.offerings.${offering}.text`)}
              </p>
            </article>
          ))}
        </div>
        <p className="mt-10 max-w-xl text-sm leading-relaxed text-muted">{t("common.priceNote")}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href={{ pathname: "/booking", query: { service: id } }}>{t("common.book")}</Button>
          <Button externalHref={whatsappUrl(t(`whatsapp.${id}`))} tone="ghost">
            {t("common.whatsapp")}
          </Button>
        </div>
        <p className="mt-10">
          <Button href="/treatments" tone="ghost">
            {t("common.back")}
          </Button>
        </p>
      </Shell>
    </>
  );
}
