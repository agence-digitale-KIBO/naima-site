import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/button";
import { InstagramPair } from "@/components/instagram-pair";
import { JsonLd } from "@/components/json-ld";
import { OpeningHours } from "@/components/opening-hours";
import { Reviews } from "@/components/reviews";
import { ServiceIndex } from "@/components/service-index";
import { Shell } from "@/components/shell";
import { media } from "@/config/media";
import { canonicalServiceSlug } from "@/config/services";
import { site } from "@/config/site";
import { assertLocale } from "@/lib/locale";
import { pageMetadata } from "@/lib/metadata";
import { beautySalonSchema } from "@/lib/schema";
import { whatsappUrl } from "@/lib/whatsapp";
import Image from "next/image";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "/", "meta.home");
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = assertLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "home" });
  const common = await getTranslations({ locale, namespace: "common" });
  const footer = await getTranslations({ locale, namespace: "footer" });
  const wa = await getTranslations({ locale, namespace: "whatsapp" });
  const pillars = ["listen", "precision", "quality", "wellbeing"] as const;

  return (
    <>
      <JsonLd data={beautySalonSchema(t("presentLead"))} />
      <section className="relative overflow-hidden border-b border-sand">
        <Shell className="grid items-center gap-12 py-14 md:min-h-[70vh] md:grid-cols-12 md:py-20">
          <div className="md:col-span-8">
            <p className="eyebrow rise text-muted">{t("heroEyebrow")}</p>
            <div className="rule mt-6" />
            <h1 className="display rise mt-6 max-w-full text-[clamp(2.7rem,11vw,6.6rem)] italic">
              {t("heroTitle")}
            </h1>
            <p className="rise mt-8 max-w-md text-lg leading-relaxed text-muted">{t("heroSubtitle")}</p>
            <div className="rise mt-8 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "120ms" }}>
              <Button href="/booking">{common("bookShort")}</Button>
              <Button href="/treatments" tone="ghost">
                {common("discover")}
              </Button>
            </div>
          </div>
          <div className="rise md:col-span-4" style={{ animationDelay: "180ms" }}>
            {media.hero ? (
              <Image
                src={media.hero.src}
                alt={media.hero.alt[locale]}
                width={media.hero.width}
                height={media.hero.height}
                priority
                className="aspect-[3/4] w-full object-cover"
              />
            ) : (
              <div className="flex min-h-56 flex-col justify-between border border-sand px-6 py-7 md:min-h-[24rem]">
                <p className="eyebrow text-muted">{t("heroArea")}</p>
                <p className="font-serif text-6xl leading-none">{t("expertiseFigure")}</p>
                <p className="max-w-[16ch] text-sm leading-relaxed text-muted">{t("expertiseUnit")}</p>
              </div>
            )}
          </div>
        </Shell>
      </section>

      <section className="py-16 md:py-24">
        <Shell className="grid gap-10 md:grid-cols-12">
          <p className="eyebrow text-muted md:col-span-3">{t("presentEyebrow")}</p>
          <div className="md:col-span-8 md:col-start-5">
            <h2 className="display max-w-[14ch] text-5xl md:text-7xl">{t("presentTitle")}</h2>
            <p className="mt-8 max-w-xl text-lg leading-relaxed">{t("presentLead")}</p>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">{t("presentBody")}</p>
          </div>
        </Shell>
        <Shell className="mt-16 grid gap-10 border-t border-sand pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar) => (
            <div key={pillar}>
              <h3 className="font-serif text-3xl">{t(`pillars.${pillar}.title`)}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{t(`pillars.${pillar}.text`)}</p>
            </div>
          ))}
        </Shell>
      </section>

      <section className="pb-8 md:pb-16">
        <Shell>
          <p className="eyebrow text-muted">{t("servicesEyebrow")}</p>
          <h2 className="display mt-4 max-w-[14ch] text-5xl md:text-6xl">{t("servicesTitle")}</h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{t("servicesIntro")}</p>
          <div className="mt-12">
            <ServiceIndex locale={locale} />
          </div>
        </Shell>
      </section>

      <section className="py-16 md:py-24">
        <Shell className="grid items-end gap-10 border-t border-sand pt-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="eyebrow text-muted">{t("expertiseEyebrow")}</p>
            <p className="display mt-4 text-[7rem] leading-none md:text-[9rem]">{t("expertiseFigure")}</p>
            <p className="mt-2 text-sm tracking-[0.14em] uppercase text-muted">{t("expertiseUnit")}</p>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <h2 className="font-serif text-4xl leading-tight md:text-5xl">{t("expertiseTitle")}</h2>
            <p className="mt-6 text-lg leading-relaxed text-muted">{t("expertiseBody")}</p>
            <p className="mt-4 text-lg leading-relaxed text-muted">{t("expertiseBody2")}</p>
          </div>
        </Shell>
      </section>

      <section className="border-y border-sand bg-[#f3efe9] py-16 md:py-24">
        <Shell className="grid items-end gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="eyebrow text-muted">{t("makeupEyebrow")}</p>
            <h2 className="display mt-4 max-w-[12ch] text-5xl italic md:text-7xl">{t("makeupTitle")}</h2>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <p className="text-lg leading-relaxed text-muted">{t("makeupBody")}</p>
            <div className="mt-8">
              <Button href="/bridal">{t("makeupLink")}</Button>
            </div>
          </div>
        </Shell>
      </section>

      <section className="py-16 md:py-24">
        <Shell className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="eyebrow text-muted">{t("portfolioEyebrow")}</p>
            <h2 className="display mt-4 text-5xl md:text-6xl">{t("portfolioTitle")}</h2>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <p className="text-lg leading-relaxed text-muted">{t("portfolioBody")}</p>
            <div className="mt-10">
              <InstagramPair studioLabel={common("instagramStudio")} makeupLabel={common("instagramMakeup")} />
            </div>
          </div>
        </Shell>
      </section>

      <section className="on-dark bg-[#efeae4] py-16 md:py-24">
        <Shell className="grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="eyebrow">{t("headSpaEyebrow")}</p>
            <h2 className="display mt-4 max-w-[12ch] text-[clamp(2.8rem,10vw,5.5rem)]">{t("headSpaTitle")}</h2>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <p className="text-lg leading-relaxed">{t("headSpaBody")}</p>
            <div className="mt-8">
              <Button
                href={{
                  pathname: "/treatments/[service]",
                  params: { service: canonicalServiceSlug("headSpa", locale) },
                }}
                tone="solid"
              >
                {t("headSpaLink")}
              </Button>
            </div>
          </div>
        </Shell>
      </section>

      <section className="py-16 md:py-24">
        <Shell className="grid gap-8 md:grid-cols-12">
          <p className="eyebrow text-muted md:col-span-3">{t("partnerEyebrow")}</p>
          <div className="md:col-span-8">
            <h2 className="font-serif text-5xl md:text-6xl">{t("partnerTitle")}</h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{t("partnerBody")}</p>
            <a
              href={site.partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex min-h-11 items-center text-sm underline underline-offset-4"
            >
              {common("partner")}
            </a>
          </div>
        </Shell>
      </section>

      <Reviews title={t("reviewsTitle")} locale={locale} />

      <section className="border-t border-sand py-16 md:py-24">
        <Shell className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="eyebrow text-muted">{t("visitEyebrow")}</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight">{site.name}</h2>
            <p className="mt-4 text-lg leading-relaxed">
              {site.street}
              <br />
              {footer("area")}
            </p>
            <ul className="mt-6 space-y-2 text-sm">
              <li>
                <a className="underline underline-offset-4" href={`tel:${site.phoneE164}`}>
                  {site.phoneDisplay}
                </a>
              </li>
              <li>
                <a className="underline underline-offset-4" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              </li>
              <li>
                <a className="underline underline-offset-4" href={whatsappUrl(wa("general"))}>
                  {common("whatsapp")}
                </a>
              </li>
            </ul>
          </div>
          <div className="min-w-0 md:col-span-7 md:col-start-6">
            <OpeningHours />
          </div>
        </Shell>
      </section>

      <section className="on-dark bg-ink py-16 text-ivory md:py-24">
        <Shell>
          <h2 className="display max-w-[16ch] text-5xl md:text-7xl">{t("closingTitle")}</h2>
          <p className="mt-6 max-w-xl text-lg text-sand">{t("closingBody")}</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button href="/booking" tone="light">
              {common("book")}
            </Button>
            <Button externalHref={whatsappUrl(wa("general"))} tone="ghost-light">
              {common("whatsapp")}
            </Button>
          </div>
        </Shell>
      </section>
    </>
  );
}
