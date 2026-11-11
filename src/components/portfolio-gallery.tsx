"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";
import { filterPortfolio, portfolioCategories, type PortfolioCategory, type PortfolioItem } from "@/config/portfolio";
import type { Locale } from "@/i18n/locales";

export function PortfolioGallery({
  items,
  locale,
  labels,
}: {
  items: PortfolioItem[];
  locale: Locale;
  labels: Record<PortfolioCategory | "all", string> & {
    filter: string;
    dialog: string;
    previous: string;
    next: string;
    close: string;
    empty: string;
  };
}) {
  const [category, setCategory] = useState<PortfolioCategory | "all">("all");
  const [index, setIndex] = useState<number | null>(null);
  const titleId = useId();
  const visible = filterPortfolio(items, category);
  const current = index !== null ? visible[index] : null;

  useEffect(() => {
    if (index === null) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setIndex(null);
      if (event.key === "ArrowRight") setIndex((value) => (value === null ? value : (value + 1) % visible.length));
      if (event.key === "ArrowLeft") {
        setIndex((value) => (value === null ? value : (value - 1 + visible.length) % visible.length));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, visible.length]);

  return (
    <div>
      <div role="group" aria-label={labels.filter} className="flex flex-wrap gap-2">
        {(["all", ...portfolioCategories] as const).map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={category === item}
            onClick={() => {
              setCategory(item);
              setIndex(null);
            }}
            className="min-h-11 px-3 text-[0.72rem] tracking-[0.14em] uppercase aria-pressed:text-ink text-muted"
          >
            {labels[item]}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="mt-10 max-w-xl text-lg text-muted">{labels.empty}</p>
      ) : (
        <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
          {visible.map((item, itemIndex) => (
            <li key={item.id}>
              <button type="button" className="block w-full text-left" onClick={() => setIndex(itemIndex)}>
                <Image
                  src={item.src}
                  alt={item.alt[locale]}
                  width={item.width}
                  height={item.height}
                  className="h-auto w-full"
                  sizes="(min-width: 768px) 33vw, 50vw"
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      {current ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <div className="relative max-h-full w-full max-w-5xl">
            <p id={titleId} className="sr-only">
              {labels.dialog}
            </p>
            <Image
              src={current.src}
              alt={current.alt[locale]}
              width={current.width}
              height={current.height}
              className="mx-auto max-h-[80vh] w-auto"
            />
            <div className="mt-4 flex items-center justify-between text-ivory">
              <button type="button" className="min-h-11 px-3" onClick={() => setIndex((value) => (value === null ? value : (value - 1 + visible.length) % visible.length))}>
                {labels.previous}
              </button>
              <button type="button" className="min-h-11 px-3" onClick={() => setIndex(null)}>
                {labels.close}
              </button>
              <button type="button" className="min-h-11 px-3" onClick={() => setIndex((value) => (value === null ? value : (value + 1) % visible.length))}>
                {labels.next}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
