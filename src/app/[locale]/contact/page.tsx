import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ContactForm } from "@/components/contact-form";
import { PageIntro } from "@/components/page-intro";
import { Shell } from "@/components/shell";
import { site } from "@/config/site";
import { assertLocale } from "@/lib/locale";
import { pageMetadata } from "@/lib/metadata";
import { whatsappUrl } from "@/lib/whatsapp";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "/contact", "meta.contact");
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = assertLocale((await params).locale);
  const t = await getTranslations({ locale });
  const message = t("whatsapp.general");

  return (
    <>
      <PageIntro eyebrow={t("contact.eyebrow")} title={t("contact.title")}>
        <p>{t("contact.lead")}</p>
      </PageIntro>
      <Shell className="grid gap-16 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <h2 className="eyebrow text-muted">{t("contact.addressTitle")}</h2>
          <p className="mt-4 font-serif text-3xl leading-snug">
            {site.name}
            <br />
            {site.street}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            {t("contact.activity")}: {site.activityArea}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted">{t("contact.areaNote")}</p>
          <p className="mt-3 text-sm text-muted">{t("contact.hours")}</p>
          <a className="mt-6 inline-flex min-h-11 items-center underline underline-offset-4" href={site.mapsUrl} target="_blank" rel="noopener noreferrer">
            {t("common.directions")}
          </a>

          <h2 className="eyebrow mt-12 text-muted">{t("contact.directTitle")}</h2>
          <ul className="mt-4 space-y-3 text-lg">
            <li>
              <a href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </li>
            <li>
              <a href={`tel:${site.phoneE164}`}>{site.phoneDisplay}</a>
            </li>
            <li>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </li>
            <li>
              <a href={site.instagram.studio} target="_blank" rel="noopener noreferrer">
                {site.instagram.studioHandle}
              </a>
            </li>
            <li>
              <a href={site.instagram.makeup} target="_blank" rel="noopener noreferrer">
                {site.instagram.makeupHandle}
              </a>
            </li>
          </ul>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <h2 className="font-serif text-4xl">{t("contact.formTitle")}</h2>
          <div className="mt-8">
            <ContactForm />
          </div>
        </div>
      </Shell>
    </>
  );
}
