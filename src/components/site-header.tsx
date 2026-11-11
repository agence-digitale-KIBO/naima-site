"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/locales";
import { canonicalServiceSlug, resolveServiceId } from "@/config/services";
import { site } from "@/config/site";

const links = [
  { href: "/treatments", key: "treatments" },
  { href: "/bridal", key: "bridal" },
  { href: "/portfolio", key: "portfolio" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

function isCurrent(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header ref={headerRef} className="site-header border-b border-sand/80 bg-ivory/95 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-[1120px] items-center justify-between gap-3 px-5 sm:gap-5 sm:px-8">
        <Link href="/" className="min-w-0 leading-none">
          <span className="block font-serif text-[1.7rem] tracking-tight">Naima</span>
          <span className="mt-1 hidden text-[0.58rem] tracking-[0.22em] uppercase text-muted sm:block">
            Studio di Bellezza
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label={t("primary")}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isCurrent(pathname, link.href) ? "page" : undefined}
              className="text-[0.72rem] tracking-[0.14em] uppercase text-muted aria-[current=page]:text-ink"
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 sm:gap-5">
          <LanguageSwitcher className="hidden lg:flex" onSwitch={() => setOpen(false)} />
          <Link
            href="/booking"
            className="inline-flex min-h-11 items-center border border-ink px-3 text-[0.68rem] tracking-[0.16em] uppercase hover:bg-ink hover:text-ivory sm:px-4"
          >
            {t("book")}
          </Link>
          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center lg:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X aria-hidden="true" size={22} /> : <Menu aria-hidden="true" size={22} />}
            <span className="sr-only">{open ? t("close") : t("menu")}</span>
          </button>
        </div>
      </div>

      {open ? (
        <div id={menuId} className="border-t border-sand bg-ivory lg:hidden">
          <nav className="mx-auto flex max-w-[1120px] flex-col px-5 py-6 sm:px-8" aria-label={t("primary")}>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-sand py-4 font-serif text-4xl"
                aria-current={isCurrent(pathname, link.href) ? "page" : undefined}
              >
                {t(link.key)}
              </Link>
            ))}
            <Link href="/booking" onClick={() => setOpen(false)} className="mt-6 inline-flex min-h-11 items-center justify-center bg-ink px-4 text-[0.72rem] tracking-[0.16em] text-ivory uppercase">
              {t("book")}
            </Link>
            <LanguageSwitcher className="mt-6" onSwitch={() => setOpen(false)} />
          </nav>
        </div>
      ) : null}
      <span className="sr-only">{site.name}</span>
    </header>
  );
}

function LanguageSwitcher({ onSwitch, className = "" }: { onSwitch: () => void; className?: string }) {
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  function change(next: Locale) {
    if (next === locale) return;
    onSwitch();
    const raw = params.service;
    const serviceParam = Array.isArray(raw) ? raw[0] : raw;
    if (typeof serviceParam === "string") {
      const id = resolveServiceId(serviceParam);
      if (id) {
        router.replace(
          { pathname: "/treatments/[service]", params: { service: canonicalServiceSlug(id, next) } },
          { locale: next },
        );
        return;
      }
    }
    if (pathname === "/treatments/[service]") {
      router.replace("/treatments", { locale: next });
      return;
    }
    router.replace(pathname, { locale: next });
  }

  return (
    <div className={`flex items-center gap-2 ${className}`} role="group" aria-label={t("languages")}>
      {locales.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => change(item)}
          aria-current={item === locale ? "true" : undefined}
          className="min-h-11 px-1 text-[0.68rem] tracking-[0.14em] uppercase text-muted aria-[current=true]:text-ink"
          lang={item}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
