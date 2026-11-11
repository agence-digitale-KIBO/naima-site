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
    <div className="grid gap-8 sm:grid-cols-2">
      {accounts.map((account) => (
        <a
          key={account.href}
          href={account.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group border-t border-sand pt-5"
        >
          <span className="eyebrow text-muted">{account.label}</span>
          <span className="mt-4 block font-serif text-3xl leading-none tracking-tight group-hover:text-taupe">
            {account.handle}
          </span>
        </a>
      ))}
    </div>
  );
}
