import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { InstagramPair } from "@/components/instagram-pair";
import { PageIntro } from "@/components/page-intro";
import { PortfolioGallery } from "@/components/portfolio-gallery";
import { Shell } from "@/components/shell";
import { portfolio, portfolioCategories, type PortfolioCategory } from "@/config/portfolio";
import { assertLocale } from "@/lib/locale";
import { pageMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "/portfolio", "meta.portfolio");
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = assertLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "portfolio" });
  const common = await getTranslations({ locale, namespace: "common" });
  const labels = {
    filter: t("categoriesLabel"),
    dialog: t("dialog"),
    previous: t("previous"),
    next: t("next"),
    close: common("closeDialog"),
    empty: t("emptyFilter"),
    all: t("categories.all"),
    nails: t("categories.nails"),
    lashes: t("categories.lashes"),
    makeup: t("categories.makeup"),
    bridal: t("categories.bridal"),
    headSpa: t("categories.headSpa"),
  } satisfies Record<PortfolioCategory | "all" | "filter" | "dialog" | "previous" | "next" | "close" | "empty", string>;

  return (
    <>
      <PageIntro eyebrow={t("eyebrow")} title={t("title")}>
        <p>{t("lead")}</p>
      </PageIntro>
      <Shell className="py-16 md:py-20">
        {portfolio.length === 0 ? (
          <>
            <p className="max-w-2xl text-lg leading-relaxed">{t("empty")}</p>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              {portfolioCategories.map((category) => (
                <li key={category} className="eyebrow text-muted">
                  {t(`categories.${category}`)}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <PortfolioGallery items={portfolio} locale={locale} labels={labels} />
        )}
        <div className="mt-16">
          <InstagramPair studioLabel={common("instagramStudio")} makeupLabel={common("instagramMakeup")} />
        </div>
      </Shell>
    </>
  );
}
