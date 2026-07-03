import Link from "next/link";
import { FormattedText } from "@/components/content/FormattedText";
import type { PropertyDetail } from "@/lib/properties/details";
import { reservasLinkProps } from "@/lib/reservasLink";
import type { PropertyListing } from "@/lib/properties/catalog";
import { PropertyDetailSearchBar } from "@/components/properties/detail/PropertyDetailSearchBar";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { PropertyDetailHero } from "@/components/properties/detail/PropertyDetailHero";
import { PropertyDetailGallery } from "@/components/properties/detail/PropertyDetailGallery";
import { galleryFromDetail } from "@/lib/properties/gallery";
import { PropertyMap } from "@/components/properties/detail/PropertyMap";
import { PropertyNearbyPoiList } from "@/components/properties/detail/PropertyNearbyPoi";
import { PropertyDetailGroupsSection } from "@/components/properties/detail/PropertyDetailGroupsSection";
import { PropertyReviewsSection } from "@/components/properties/detail/PropertyReviewsSection";
import type { PropertyReview } from "@/lib/properties/reviewsTypes";
import { DEFAULT_SITE_LANGUAGE, type SiteLanguage } from "@/lib/i18n";

type Props = {
  property: PropertyDetail;
  related: PropertyListing[];
  reviews: PropertyReview[];
  whatsappUrl?: string;
  language?: SiteLanguage;
};

export function PropertyDetailView({
  property,
  related,
  reviews,
  whatsappUrl,
  language = DEFAULT_SITE_LANGUAGE,
}: Props) {
  const galleryImages = galleryFromDetail(property);

  return (
    <main className="bg-white">
      <PropertyDetailHero property={property} whatsappUrl={whatsappUrl} />

      <div className="mx-auto max-w-[1440px] px-6 pb-16 pt-10 lg:px-12 lg:pt-12">
        <PropertyDetailSearchBar
          gnahsId={property.gnahsId}
          language={language}
        />

        <div data-reveal className="relative z-0">
          <PropertyDetailGallery
            images={galleryImages}
            hasOffer={property.hasOffer}
            isPopular={property.isPopular}
          />
        </div>

        <section
          data-reveal
          className="mt-16 grid gap-10 lg:grid-cols-[2fr_3fr] lg:items-start lg:gap-12"
        >
          <div>
            <h2 className="text-xl font-bold text-neutral-950">Sobre el edificio</h2>
            <FormattedText
              value={property.about}
              className="mt-4 text-[15px] leading-relaxed text-neutral-600"
            />
            <PropertyNearbyPoiList poi={property.poi} />
          </div>
          <PropertyMap
            address={property.address}
            neighborhood={property.neighborhood}
            city={property.city}
          />
        </section>

        <section data-reveal className="mt-16">
          <h2 className="text-xl font-bold text-neutral-950">Unidades</h2>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {property.units.map((unit) => (
              <li
                key={unit.name}
                className="flex flex-col rounded-lg border border-neutral-200 p-5"
              >
                <h3 className="text-[17px] font-bold text-neutral-950">{unit.name}</h3>
                <p className="mt-1 text-[14px] text-neutral-500">{unit.sqm}</p>
                <p className="mt-1 text-[14px] text-neutral-500">{unit.guests}</p>
                <p className="mt-3 text-[13px] text-neutral-600">{unit.features}</p>
                {unit.tourUrl ? (
                  <div className="mt-6">
                    <a
                      href={unit.tourUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-btn text-[13px] font-medium text-btn hover:bg-neutral-50 sm:w-auto sm:min-w-[140px]"
                    >
                      Tour 360°
                    </a>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </section>

        <PropertyReviewsSection
          propertySlug={property.slug}
          propertyName={property.name}
          reviews={reviews}
        />
      </div>

      <PropertyDetailGroupsSection
        headline={property.groupsHeadline}
        description={property.groupsDescription}
        ctaLabel={property.groupsCtaLabel}
        ctaHref={property.groupsCtaHref}
        stats={property.stats}
      />

      {related.length > 0 ? (
        <section data-reveal className="mx-auto max-w-[1440px] px-6 py-16 lg:px-12">
          <h2 className="text-xl font-bold text-neutral-950">Otras propiedades</h2>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <li key={p.slug}>
                <PropertyCard property={p} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section data-reveal className="bg-[#111111] px-6 py-12 text-white lg:px-12 lg:py-14">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
          <div className="max-w-2xl">
            <h2 className="text-[clamp(1.5rem,2.8vw,2.25rem)] font-bold leading-tight tracking-tight text-white">
              {property.finalCtaTitle}
            </h2>
            {property.finalCtaSubtitle ? (
              <p className="mt-4 text-[15px] leading-relaxed text-[#AAAAAA] lg:text-base">
                {property.finalCtaSubtitle}
              </p>
            ) : null}
          </div>
          <Link
            href={property.finalCtaHref}
            {...reservasLinkProps(property.finalCtaHref)}
            className="inline-flex h-11 shrink-0 items-center justify-center self-start rounded-lg bg-white px-6 text-[14px] font-semibold text-neutral-950 hover:bg-neutral-100 lg:self-center"
          >
            Reservar ahora →
          </Link>
        </div>
      </section>

    </main>
  );
}
