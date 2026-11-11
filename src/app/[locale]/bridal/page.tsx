import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/button";
import { InstagramPair } from "@/components/instagram-pair";
import { JsonLd } from "@/components/json-ld";
import { Shell } from "@/components/shell";
import { media } from "@/config/media";
import { serviceOfferings } from "@/config/services";
import { assertLocale } from "@/lib/locale";
import { pageMetadata } from "@/lib/metadata";
import { serviceSchema } from "@/lib/schema";
import { whatsappUrl } from "@/lib/whatsapp";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "/bridal", "meta.bridal");
}

export default async function BridalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = assertLocale((await params).locale);
  const t = await getTranslations({ locale });
  const offerings = serviceOfferings("makeup");
  const photo = media.bridal ?? media.services.makeup;

  return (
    <>
      <JsonLd data={serviceSchema(t("services.makeup.title"), t("bridal.lead"))} />
      <header className="on-dark bg-ink text-ivory">
        <Shell className="grid gap-10 py-16 md:grid-cols-12 md:py-24">
          <div className="md:col-span-7">
            <p className="eyebrow text-sand">{t("bridal.eyebrow")}</p>
            <div className="rule mt-5" />
            <h1 className="display mt-6 max-w-[12ch] text-[clamp(3.2rem,7vw,6rem)] italic">
              {t("bridal.title")}
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-sand">{t("bridal.lead")}</p>
          </div>
          {photo ? (
            <Image
              src={photo.src}
              alt={photo.alt[locale]}
              width={photo.width}
              height={photo.height}
              priority
              className="h-full w-full object-cover md:col-span-5"
            />
          ) : (
            <p className="self-end font-serif text-6xl text-ivory/15 md:col-span-5 md:text-8xl">Naima</p>
          )}
        </Shell>
      </header>
      <Shell className="grid gap-12 py-16 md:grid-cols-12 md:py-24">
        <p className="text-lg leading-relaxed md:col-span-7">{t("bridal.body")}</p>
        <div className="border-t border-sand pt-6 md:col-span-4 md:col-start-9">
          <h2 className="font-serif text-3xl">{t("bridal.approachTitle")}</h2>
          <p className="mt-4 leading-relaxed text-muted">{t("bridal.approachBody")}</p>
        </div>
      </Shell>
      <Shell className="pb-8">
        {offerings.map((offering, index) => (
          <article key={offering} className="grid gap-4 border-t border-sand py-10 md:grid-cols-12">
            <p className="font-serif text-2xl text-taupe md:col-span-1">{String(index + 1).padStart(2, "0")}</p>
            <h2 className="font-serif text-4xl md:col-span-5">{t(`services.makeup.offerings.${offering}.title`)}</h2>
            <p className="leading-relaxed text-muted md:col-span-5">
              {t(`services.makeup.offerings.${offering}.text`)}
            </p>
          </article>
        ))}
        <p className="max-w-xl pt-6 text-sm text-muted">{t("common.priceNote")}</p>
      </Shell>
      <section className="bg-[#f3efe9] py-16 md:py-24">
        <Shell className="grid gap-10 md:grid-cols-2 md:items-end">
          <div>
            <h2 className="font-serif text-4xl md:text-5xl">{t("bridal.instagramTitle")}</h2>
            <p className="mt-4 max-w-md leading-relaxed text-muted">{t("bridal.instagramBody")}</p>
          </div>
          <InstagramPair studioLabel={t("common.instagramStudio")} makeupLabel={t("common.instagramMakeup")} />
        </Shell>
      </section>
      <Shell className="flex flex-col gap-3 py-16 sm:flex-row">
        <Button href={{ pathname: "/booking", query: { service: "makeup" } }}>{t("common.book")}</Button>
        <Button externalHref={whatsappUrl(t("whatsapp.makeup"))} tone="ghost">
          {t("common.whatsapp")}
        </Button>
      </Shell>
    </>
  );
}
