"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";

export function MobileBookingBar() {
  const t = useTranslations("common");
  const pathname = usePathname();
  if (pathname === "/booking") return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-sand bg-ivory/95 px-4 py-3 backdrop-blur-md md:hidden">
      <Link
        href="/booking"
        className="flex min-h-11 items-center justify-center bg-ink text-[0.72rem] tracking-[0.16em] text-ivory uppercase"
      >
        {t("bookShort")}
      </Link>
    </div>
  );
}
