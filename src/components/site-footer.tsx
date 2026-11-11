import { getTranslations } from "next-intl/server";
import { site } from "@/config/site";
import { Link } from "@/i18n/navigation";
import { Shell } from "@/components/shell";
import type { Locale } from "@/i18n/locales";

export async function SiteFooter({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });

  return (
    <footer className="border-t border-sand bg-ivory">
      <Shell className="grid gap-12 py-14 md:grid-cols-12 md:py-16">
        <div className="md:col-span-4">
          <p className="font-serif text-3xl">Naima</p>
          <p className="eyebrow mt-2 text-muted">Studio di Bellezza</p>
          <p className="mt-6 text-sm leading-relaxed text-muted">
            {site.founder}
            <br />
            {site.street}
            <br />
            {t("footer.area")}
          </p>
        </div>
        <div className="md:col-span-4">
          <p className="eyebrow text-muted">{t("footer.contact")}</p>
          <ul className="mt-4 space-y-2 text-sm">
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
        <div className="md:col-span-4">
          <p className="eyebrow text-muted">{t("footer.explore")}</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/treatments">{t("nav.treatments")}</Link>
            </li>
            <li>
              <Link href="/bridal">{t("nav.bridal")}</Link>
            </li>
            <li>
              <Link href="/portfolio">{t("nav.portfolio")}</Link>
            </li>
            <li>
              <Link href="/about">{t("nav.about")}</Link>
            </li>
            <li>
              <Link href="/booking">{t("nav.book")}</Link>
            </li>
            <li>
              <Link href="/contact">{t("nav.contact")}</Link>
            </li>
          </ul>
        </div>
      </Shell>
      <div className="border-t border-sand">
        <Shell className="flex flex-col gap-3 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {site.founded}–{site.copyrightYear} {site.name}
          </p>
          <div className="flex gap-5">
            <Link href="/privacy">{t("footer.privacy")}</Link>
            <Link href="/cookies">{t("footer.cookies")}</Link>
            <span>{t("footer.credit")}</span>
          </div>
        </Shell>
      </div>
    </footer>
  );
}
