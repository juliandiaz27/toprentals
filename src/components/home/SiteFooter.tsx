import Link from "next/link";
import type { HomeFooterContent } from "@/lib/pageContent/homeTypes";

type Props = {
  footer: HomeFooterContent;
};

const footerText = "text-[#AAAAAA]";
const footerHover = "hover:text-white";

export function SiteFooter({ footer }: Props) {
  return (
    <footer
      data-reveal
      className={`mt-auto bg-[#111111] px-6 py-12 sm:px-8 lg:px-16 lg:py-14 ${footerText}`}
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-[18px] font-bold uppercase tracking-[0.04em] text-white">
            {footer.brand}
          </p>
          <p className="text-[14px]">{footer.tagline}</p>
          <p className="text-[14px]">{footer.siteUrl}</p>
          <p className="mt-8 text-[12px] lg:mt-12">{footer.copyright}</p>
        </div>

        <div className="flex flex-col gap-6 lg:items-end lg:text-right">
          <nav
            className="flex flex-wrap gap-x-6 gap-y-2 text-[14px] lg:justify-end"
            aria-label="Pie de página"
          >
            {footer.links.map((item, index) => (
              <Link
                key={`${item.href}-${index}`}
                href={item.href}
                className={`transition ${footerHover}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[14px] text-[#666666]">
            <Link
              href={footer.instagramUrl}
              className="transition hover:text-[#AAAAAA]"
            >
              Instagram
            </Link>
            <span aria-hidden>·</span>
            <Link
              href={footer.facebookUrl}
              className="transition hover:text-[#AAAAAA]"
            >
              Facebook
            </Link>
            <span aria-hidden>·</span>
            <Link
              href={footer.whatsappUrl}
              className="transition hover:text-[#AAAAAA]"
            >
              WhatsApp
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
