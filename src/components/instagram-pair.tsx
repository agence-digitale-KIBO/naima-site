import { site } from "@/config/site";

export function InstagramPair({
  studioLabel,
  makeupLabel,
}: {
  studioLabel: string;
  makeupLabel: string;
}) {
  const accounts = [
    { label: studioLabel, href: site.instagram.studio, handle: site.instagram.studioHandle },
    { label: makeupLabel, href: site.instagram.makeup, handle: site.instagram.makeupHandle },
  ];

  return (
    <div className="grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-2">
      {accounts.map((account) => (
        <a
          key={account.href}
          href={account.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group block min-w-0 border-t border-sand pt-5"
        >
          <span className="eyebrow text-muted">{account.label}</span>
          <span className="mt-4 block min-w-0 font-serif text-[clamp(1.35rem,3vw,2.15rem)] leading-tight break-words [overflow-wrap:anywhere] group-hover:text-taupe">
            {account.handle}
          </span>
        </a>
      ))}
    </div>
  );
}
