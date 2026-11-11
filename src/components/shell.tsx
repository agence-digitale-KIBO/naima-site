import type { ReactNode } from "react";

export function Shell({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "header" | "footer" | "nav";
}) {
  return <Tag className={`mx-auto w-full min-w-0 max-w-[1120px] px-5 sm:px-8 ${className}`}>{children}</Tag>;
}
