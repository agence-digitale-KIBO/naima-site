import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { assertLocale } from "@/lib/locale";
import { pageMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "/privacy", "meta.privacy");
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = assertLocale((await params).locale);
  return <LegalPage locale={locale} namespace="privacy" />;
}
