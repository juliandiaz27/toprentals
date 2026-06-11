import Link from "next/link";
import { FormattedText } from "@/components/content/FormattedText";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { PropertyHighlightBadges } from "@/components/properties/PropertyHighlightBadges";
import { reservasLinkProps } from "@/lib/reservasLink";
import type { PropertyDetail } from "@/lib/properties/details";

type Props = {
  property: PropertyDetail;
  whatsappUrl?: string;
};

const pillClass =
  "inline-flex shrink-0 items-center rounded-full bg-white px-4 py-2 text-[13px] font-medium text-neutral-800";

export function PropertyDetailHero({ property, whatsappUrl }: Props) {
  const pdfLabel = property.pdfLabel ?? "Descargar PDF torre";

  return (
    <header data-reveal className="relative border-y border-neutral-200 bg-[#F8F8F8]">
      {whatsappUrl ? (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute right-5 top-[7.5rem] z-10 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_16px_rgba(0,0,0,0.18)] transition hover:scale-105 lg:right-10 lg:top-[8.25rem]"
          aria-label="WhatsApp"
        >
          <WhatsAppIcon />
        </a>
      ) : null}

      <div className="mx-auto w-full max-w-[1440px] px-6 py-8 pr-[4.5rem] lg:px-12 lg:py-10 lg:pr-[5.5rem]">
        <nav className="text-[13px] text-neutral-500" aria-label="Miga de pan">
          <Link href="/" className="hover:text-neutral-950">
            Inicio
          </Link>
          <span className="mx-1.5">/</span>
          <Link href="/propiedades" className="hover:text-neutral-950">
            Propiedades
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-neutral-700">{property.name}</span>
        </nav>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <h1 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-tight tracking-tight text-neutral-950">
            {property.name}
          </h1>
          <PropertyHighlightBadges
            hasOffer={property.hasOffer}
            isPopular={property.isPopular}
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 gap-y-3 pr-14 lg:pr-16">
          <ul className="flex flex-wrap gap-2">
            {property.tags.map((tag) => (
              <li key={tag}>
                <span className={pillClass}>{tag}</span>
              </li>
            ))}
          </ul>
          <a href={property.pdfHref} className={pillClass}>
            {pdfLabel}
          </a>
        </div>

        <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <FormattedText
            value={property.subtitle}
            className="max-w-xl text-[15px] font-normal leading-snug text-neutral-950 lg:text-base"
          />
          <Link
            href="/reservas"
            {...reservasLinkProps("/reservas")}
            className="inline-flex h-11 shrink-0 items-center justify-center self-start rounded-md bg-btn px-5 text-[14px] font-medium text-white hover:bg-btn-hover sm:self-center"
          >
            Consultar disponibilidad →
          </Link>
        </div>
      </div>
    </header>
  );
}
