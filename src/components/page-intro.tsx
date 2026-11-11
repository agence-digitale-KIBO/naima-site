import type { ReactNode } from "react";
import { Shell } from "@/components/shell";

export function PageIntro({
  eyebrow,
  title,
  children,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
  dark?: boolean;
}) {
  return (
    <header className={dark ? "on-dark bg-ink text-ivory" : "border-b border-sand"}>
      <Shell className="py-16 md:py-24">
        <p className={`eyebrow ${dark ? "text-sand" : "text-muted"}`}>{eyebrow}</p>
        <div className="rule mt-5" />
        <h1 className="display mt-6 max-w-[12ch] text-[clamp(3.1rem,8vw,6rem)]">{title}</h1>
        {children ? (
          <div className={`mt-8 max-w-xl text-lg leading-relaxed ${dark ? "text-sand" : "text-muted"}`}>
            {children}
          </div>
        ) : null}
      </Shell>
    </header>
  );
}
