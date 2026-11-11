import { getTranslations } from "next-intl/server";
import { PageIntro } from "@/components/page-intro";
import { Shell } from "@/components/shell";
import type { Locale } from "@/i18n/locales";

export async function LegalPage({
  namespace,
  locale,
}: {
  namespace: "privacy" | "cookies";
  locale: Locale;
}) {
  const t = await getTranslations({ locale, namespace });
  const sections = t.raw("sections") as Array<{ title: string; paragraphs: string[] }>;

  return (
    <>
      <PageIntro eyebrow={t("eyebrow")} title={t("title")} />
      <Shell className="py-16 md:py-20">
        <p className="max-w-2xl border border-sand px-5 py-4 text-sm leading-relaxed">{t("notice")}</p>
        <div className="mt-14 max-w-2xl space-y-12">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-serif text-4xl">{section.title}</h2>
              <div className="mt-4 space-y-4 text-base leading-relaxed text-muted">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </Shell>
    </>
  );
}
