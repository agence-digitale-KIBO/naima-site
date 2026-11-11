import { reviews, type Review } from "@/config/reviews";
import type { Locale } from "@/i18n/locales";

export function Reviews({
  title,
  locale,
  items = reviews,
}: {
  title: string;
  locale: Locale;
  items?: readonly Review[];
}) {
  if (items.length === 0) return null;

  return (
    <section className="border-t border-sand py-20 md:py-28" aria-labelledby="reviews-title">
      <div className="mx-auto w-full max-w-[1120px] px-5 sm:px-8">
        <h2 id="reviews-title" className="display text-5xl">
          {title}
        </h2>
        <ul className="mt-12 grid gap-12">
          {items.map((review) => (
            <li key={review.id} className="max-w-2xl border-t border-sand pt-6">
              <blockquote className="font-serif text-3xl leading-snug">
                {review.text[locale]}
              </blockquote>
              <p className="mt-4 text-sm text-muted">
                {review.name}
                {review.source ? ` · ${review.source}` : ""}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
