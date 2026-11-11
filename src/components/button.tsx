import type { ComponentProps, ReactNode } from "react";
import { Link } from "@/i18n/navigation";

type Tone = "solid" | "light" | "ghost" | "ghost-light";

const tones: Record<Tone, string> = {
  solid: "bg-ink text-ivory hover:bg-[#2a2826]",
  light: "bg-ivory text-ink hover:bg-sand",
  ghost: "border border-ink/20 text-ink hover:border-ink",
  "ghost-light": "border border-ivory/35 text-ivory hover:border-ivory",
};

const base =
  "inline-flex min-h-11 items-center justify-center px-5 text-center text-[0.72rem] font-medium tracking-[0.16em] uppercase transition-colors duration-200";

export function Button({
  href,
  externalHref,
  tone = "solid",
  className = "",
  children,
}: {
  href?: ComponentProps<typeof Link>["href"];
  externalHref?: string;
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  const classes = `${base} ${tones[tone]} ${className}`;

  if (externalHref) {
    const outbound = externalHref.startsWith("http");
    return (
      <a
        className={classes}
        href={externalHref}
        {...(outbound ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <Link className={classes} href={href ?? "/"}>
      {children}
    </Link>
  );
}
