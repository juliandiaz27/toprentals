import Link from "next/link";
import { FormattedText } from "@/components/content/FormattedText";
import { BrandWordmark } from "@/components/brand/BrandShapes";
import type { HomeFooterContent } from "@/lib/pageContent/homeTypes";

type Props = {
  footer: HomeFooterContent;
  designedByLabel?: string;
};

const footerHover = "transition hover:text-white";

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" />
    </svg>
  );
}

function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="currentColor" aria-hidden>
      <path d="M13.5 21v-7.6h2.6l.4-3h-3V8.5c0-.9.3-1.5 1.5-1.5h1.6V4.3A21 21 0 0 0 14.3 4c-2.3 0-3.9 1.4-3.9 4v2.4H7.8v3h2.6V21z" />
    </svg>
  );
}

function IconWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" aria-hidden>
      <path
        d="M4 20l1.2-4.2A8.5 8.5 0 1 1 8.4 19z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9.2 8.4c.2-.4.4-.4.7-.4h.5c.2 0 .4 0 .5.4l.7 1.6c.1.2 0 .4-.1.6l-.5.6c-.1.1-.1.3 0 .5a6 6 0 0 0 2.7 2.4c.2.1.4.1.5-.1l.6-.7c.2-.2.4-.2.6-.1l1.5.7c.3.1.3.3.3.5 0 .9-.6 1.6-1.6 1.7-.9.1-2.2-.2-3.8-1.4a8.6 8.6 0 0 1-2.6-3.1c-.5-1.1-.4-2 0-2.8z"
        fill="currentColor"
      />
    </svg>
  );
}

export function SiteFooter({
  footer,
  designedByLabel = "Diseño y desarrollo web por",
}: Props) {
  return (
    <footer
      data-reveal
      className="mt-auto bg-[#111111] px-6 pb-8 pt-12 text-white sm:px-8 lg:px-16"
    >
      <div className="mx-auto w-full max-w-[1440px]">
        <nav
          className="flex flex-wrap justify-center gap-x-10 gap-y-3 text-[14px] lg:gap-x-[72px]"
          aria-label="Footer"
        >
          {footer.links.map((item, index) => (
            <Link
              key={`${item.href}-${index}`}
              href={item.href}
              className={`text-white/90 ${footerHover}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-12 grid items-center gap-10 text-center lg:grid-cols-3 lg:text-left">
          <div>
            <p className="font-display text-[14px] font-bold uppercase tracking-[0.08em]">
              {footer.siteUrl}
            </p>
            <FormattedText value={footer.tagline} className="text-[14px] text-white/70" />
          </div>

          <Link href="/" className="flex flex-col items-center" aria-label={footer.brand}>
            <BrandWordmark className="text-[34px]" />
            <span className="mt-2 font-display text-[10px] font-semibold uppercase tracking-[0.28em]">
              Temporary Apartments
            </span>
          </Link>

          <div className="flex items-center justify-center gap-5 lg:justify-end">
            <a href={footer.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={footerHover}>
              <IconInstagram />
            </a>
            <a href={footer.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={footerHover}>
              <IconFacebook />
            </a>
            <a href={footer.whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className={footerHover}>
              <IconWhatsApp />
            </a>
          </div>
        </div>

        <div className="mt-12 text-center text-[12px] text-white/80">
          <p>{footer.copyright}</p>
          <p className="mt-1 text-white/50">
            {designedByLabel}{" "}
            <a
              href="https://magnamadigital.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`underline underline-offset-2 ${footerHover}`}
            >
              Magnama digital
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
