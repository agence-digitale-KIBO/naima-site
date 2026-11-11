import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getSiteUrl, isIndexable } from "@/lib/site-url";
import { CookieNotice } from "@/components/cookie-notice";
import { MobileBookingBar } from "@/components/mobile-booking-bar";
import { OpeningStatusBanner } from "@/components/opening-status-banner";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "../globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const sans = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-manrope",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#f8f6f2",
  width: "device-width",
  initialScale: 1,
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "meta.home" });

  return {
    metadataBase: new URL(getSiteUrl()),
    title: { absolute: t("title") },
    description: t("description"),
    applicationName: "Naima Studio di Bellezza",
    authors: [{ name: "Naima Natoli" }],
    robots: isIndexable()
      ? { index: true, follow: true }
      : { index: false, follow: false },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "common" });
  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return (
    <html lang={locale} className={`${serif.variable} ${sans.variable} h-full`}>
      <body className="min-h-full bg-ivory pb-24 font-sans text-ink antialiased md:pb-0">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <a className="skip-link" href="#content">
            {t("skip")}
          </a>
          <div className="site-chrome">
            <OpeningStatusBanner />
            <SiteHeader />
          </div>
          <CookieNotice />
          <main id="content">{children}</main>
          <SiteFooter locale={locale} />
          <MobileBookingBar />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
