import Link from "next/link";
import type { HomeHeaderContent } from "@/lib/pageContent/homeTypes";

type Props = {
  header: HomeHeaderContent;
};

const NAV_KEYS = [
  { label: "link1Label", href: "link1Href" },
  { label: "link2Label", href: "link2Href" },
  { label: "link3Label", href: "link3Href" },
] as const;

export function SiteHeader({ header }: Props) {
  const links = NAV_KEYS.map((k) => ({
    label: header[k.label],
    href: header[k.href],
  })).filter((l) => l.label);

  return (
    <header className="site-header relative z-50 border-b border-neutral-200 bg-white">
      <div className="mx-auto grid h-[72px] max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 lg:px-12">
        <Link
          href="/"
          className="justify-self-start text-[15px] font-bold uppercase tracking-[0.04em] text-neutral-950"
        >
          {header.logoText}
        </Link>

        <nav
          className="hidden items-center justify-center gap-10 lg:flex"
          aria-label="Principal"
        >
          {links.map((item) => (
            <Link
              key={item.href + item.label}
              href={item.href}
              className="text-[14px] font-normal text-neutral-950 transition-colors hover:text-neutral-600"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-6">
          <div
            className="hidden items-center gap-2 text-[14px] text-neutral-950 sm:flex"
            aria-label="Idioma"
          >
            <span className="font-medium">ES</span>
            <span className="font-light text-neutral-300">|</span>
            <Link
              href="?lang=en"
              className="font-normal text-neutral-500 transition-colors hover:text-neutral-950"
            >
              EN
            </Link>
          </div>
          <Link
            href={header.ctaHref}
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-neutral-950 px-5 text-[14px] font-medium text-white transition-colors hover:bg-neutral-800"
          >
            {header.ctaLabel}
          </Link>
        </div>
      </div>
    </header>
  );
}
