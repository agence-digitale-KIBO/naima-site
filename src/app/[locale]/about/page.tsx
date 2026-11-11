import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { PageIntro } from "@/components/page-intro";
import { Shell } from "@/components/shell";
import { media } from "@/config/media";
import { assertLocale } from "@/lib/locale";
import { pageMetadata } from "@/lib/metadata";

const qualities = ["precision", "speed", "products", "listen", "detail", "punctual", "training", "innovation"] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "/about", "meta.about");
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = assertLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "about" });
  const portrait = media.about;

  return (
    <>
      <PageIntro eyebrow={t("eyebrow")} title={t("title")}>
        <p>{t("lead")}</p>
      </PageIntro>
      <Shell className="grid gap-12 py-16 md:grid-cols-12 md:py-24">
        <div className="md:col-span-7">
          <p className="text-lg leading-relaxed">{t("story")}</p>
          <p className="mt-5 text-lg leading-relaxed text-muted">{t("clients")}</p>
        </div>
        {portrait ? (
          <Image
            src={portrait.src}
            alt={portrait.alt[locale]}
            width={portrait.width}
            height={portrait.height}
            className="h-auto w-full md:col-span-4 md:col-start-9"
          />
        ) : (
          <p className="font-serif text-7xl leading-none text-sand md:col-span-4 md:col-start-9 md:text-8xl">2016</p>
        )}
      </Shell>
      <Shell className="pb-20">
        <h2 className="font-serif text-4xl">{t("practiceTitle")}</h2>
        <dl className="mt-8 grid gap-x-10 sm:grid-cols-2">
          {qualities.map((quality) => (
            <div key={quality} className="border-t border-sand py-5">
              <dt className="font-serif text-2xl">{t(`qualities.${quality}.title`)}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted">{t(`qualities.${quality}.text`)}</dd>
            </div>
          ))}
        </dl>
      </Shell>
    </>
  );
}
