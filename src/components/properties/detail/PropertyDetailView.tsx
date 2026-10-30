import Link from "next/link";
import { FormattedText } from "@/components/content/FormattedText";
import { BrandArch, BrandWaveBand } from "@/components/brand/BrandShapes";
import type { PropertyDetail } from "@/lib/properties/details";
import type { PropertyListing } from "@/lib/properties/catalog";
import { getGnahsBookingRouteForEstablishment } from "@/lib/gnahs/buildBookingUrl";
import { reservasLinkProps } from "@/lib/reservasLink";
import { HomeBookingSearch } from "@/components/home/HomeBookingSearch";
import { HomeFeaturedPropertyCard } from "@/components/home/HomeFeaturedPropertyCard";
import { PropertyDetailGallery } from "@/components/properties/detail/PropertyDetailGallery";
import { galleryFromDetail } from "@/lib/properties/gallery";
import { PropertyMap } from "@/components/properties/detail/PropertyMap";
import { PropertyAmenities } from "@/components/properties/detail/PropertyAmenities";
import { PropertyDetailGroupsSection } from "@/components/properties/detail/PropertyDetailGroupsSection";
import { PropertyReviewsSection } from "@/components/properties/detail/PropertyReviewsSection";
import { WhatsAppFab } from "@/components/properties/WhatsAppFab";
import { ElfsightGoogleReviews } from "@/components/elfsight/ElfsightGoogleReviews";
import type { PropertyReview } from "@/lib/properties/reviewsTypes";
import { DEFAULT_SITE_LANGUAGE, type SiteLanguage } from "@/lib/i18n";
import { getUiMessages } from "@/lib/i18n/ui";

type Props = {
  property: PropertyDetail;
  related: PropertyListing[];
  reviews: PropertyReview[];
  whatsappUrl?: string;
  language?: SiteLanguage;
};

/** Colores de los restaurantes, en el orden del Figma. */
const RESTAURANT_COLORS = ["bg-tr-green", "bg-tr-orange", "bg-tr-red", "bg-tr-amber"];

const LABELS = {
  es: {
    checkAvailability: "Consultar disponibilidad",
    checkUnit: "Ver disponibilidad",
    aboutTitle: "Sobre el <em>edificio</em>",
    poiTitle: "<em>Puntos de interés</em> cercanos",
    restaurants: "Restaurantes",
    unitsTitle: "Unidades <em>disponibles</em>",
    models: (n: number) => (n === 1 ? "1 modelo" : `${n} modelos`),
    amenitiesTitle: "<em>Amenities</em> & servicios",
    relatedTitle: "Otras <em>propiedades</em>",
    seeAll: "Ver todas →",
    book: "Reservar",
    bookNow: "Reservar ahora →",
  },
  en: {
    checkAvailability: "Check availability",
    checkUnit: "See availability",
    aboutTitle: "About the <em>building</em>",
    poiTitle: "<em>Nearby</em> places",
    restaurants: "Restaurants",
    unitsTitle: "Available <em>units</em>",
    models: (n: number) => (n === 1 ? "1 layout" : `${n} layouts`),
    amenitiesTitle: "<em>Amenities</em> & services",
    relatedTitle: "Other <em>properties</em>",
    seeAll: "See all →",
    book: "Book",
    bookNow: "Book now →",
  },
};

const headingClass = "tr-heading text-[clamp(1.25rem,2vw,1.6rem)] [&_em]:text-[1.25em]";

/** Valor de una cifra de la ficha por su etiqueta (ej. «Unidades»), si está cargada. */
function statValue(property: PropertyDetail, pattern: RegExp): string {
  const stat = property.stats.find((s) => pattern.test(s.label));
  const value = String(stat?.value ?? "").trim();
  return value && value !== "—" ? value : "";
}

export function PropertyDetailView({
  property,
  related,
  reviews,
  whatsappUrl,
  language = DEFAULT_SITE_LANGUAGE,
}: Props) {
  const ui = getUiMessages(language);
  const t = language === "en" ? LABELS.en : LABELS.es;
  const galleryImages = galleryFromDetail(property);
  const bookingRoute =
    property.gnahsId > 0 ? getGnahsBookingRouteForEstablishment(property.gnahsId) : "/reservas";

  const unitsCount = statValue(property, /unidad|unit/i);
  const guestsCount = statValue(property, /huésped|huesped|guest/i);
  const bannerImage = property.bannerImage || galleryImages[0] || "";
  const bannerPills =
    property.bannerPills.length > 0
      ? property.bannerPills
      : [
          unitsCount ? `${unitsCount} ${ui.properties.units}` : "",
          guestsCount ? `${guestsCount} ${ui.properties.guests}` : "",
          ...property.tags,
        ]
          .filter(Boolean)
          .slice(0, 4);
  const unitsSummary = [
    t.models(property.units.length),
    unitsCount ? `${unitsCount} ${ui.properties.units.toLowerCase()}` : "",
    guestsCount ? `${guestsCount} ${ui.properties.guests.toLowerCase()}` : "",
  ]
    .filter(Boolean)
    .join(" · ");
  const poiPlaces = property.poiPlaces;
  /* El botón de la franja lleva a grupos si lo menciona; si no, al motor de la torre */
  const introHref = /grupo/i.test(property.introCtaLabel)
    ? property.groupsCtaHref
    : bookingRoute;
  const poiHasImages = poiPlaces.some((p) => p.imageSrc);

  return (
    <main className="bg-white">
      {/* Migas + galería sobre crema */}
      <section className="bg-tr-cream px-3 pb-6 pt-3 lg:px-3">
        <nav
          className="mx-auto max-w-[1440px] px-3 text-[11px] text-tr-ink lg:px-12"
          aria-label={ui.blog.breadcrumb}
        >
          <Link href="/" className="hover:underline">
            {ui.nav.home}
          </Link>
          <span className="mx-1.5">/</span>
          <Link href="/propiedades" className="hover:underline">
            {ui.nav.properties}
          </Link>
          <span className="mx-1.5">/</span>
          <span>{property.name}</span>
        </nav>
        <div data-reveal className="relative z-0 mx-auto mt-3 max-w-[1440px]">
          <PropertyDetailGallery
            images={galleryImages}
            hasOffer={property.hasOffer}
            isPopular={property.isPopular}
          />
        </div>
      </section>

      {/* Buscador de la torre */}
      <section className="relative z-30 border-b border-neutral-200 bg-white px-6 py-5 lg:px-16">
        <div className="mx-auto max-w-[1440px] lg:px-10">
          <HomeBookingSearch
            listings={[]}
            bookingRoute={bookingRoute}
            initialEstablishmentId={property.gnahsId > 0 ? property.gnahsId : undefined}
            hideEstablishment
            submitLabel={t.book}
            language={language === "en" ? "en" : "es"}
          />
        </div>
      </section>

      {/* Franja con el nombre del edificio */}
      <section className="relative isolate overflow-hidden bg-tr-ink px-6 py-14 text-center text-white lg:py-16">
        {bannerImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={bannerImage} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />
            <span className="absolute inset-0 -z-10 bg-black/55" aria-hidden />
          </>
        ) : null}
        <BrandArch className="pointer-events-none absolute left-[6%] top-[20%] hidden h-[64px] w-[70px] text-tr-orange lg:block" />
        <h1 className="tr-heading text-[clamp(1.5rem,2.6vw,2rem)] !text-white [&_em]:text-[1.25em]">
          <FormattedText value={property.bannerTitle || property.name} as="inline" />
        </h1>
        {property.subtitle ? (
          <FormattedText
            value={property.subtitle}
            className="mx-auto mt-3 block max-w-2xl text-[12px] uppercase tracking-[0.04em] text-white/95"
          />
        ) : null}
        {bannerPills.length > 0 ? (
          <ul className="mt-5 flex flex-wrap justify-center gap-2.5">
            {bannerPills.map((pill) => (
              <li
                key={pill}
                className="rounded-full bg-tr-sky px-4 py-1 text-[11px] font-medium text-tr-ink"
              >
                {pill}
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      {property.introText ? (
        <section className="border-b border-neutral-200 bg-white px-6 py-4 lg:px-16">
          <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 lg:px-10">
            <FormattedText value={property.introText} className="block text-[13px] text-tr-ink" />
            <Link
              href={introHref}
              {...reservasLinkProps(introHref)}
              className="inline-flex h-9 items-center rounded-[2px] bg-tr-ink px-4 text-[12px] font-medium text-white transition hover:bg-black"
            >
              {(property.introCtaLabel || t.checkAvailability).replace(/\s*→\s*$/, "")} →
            </Link>
          </div>
        </section>
      ) : null}

      {/*
        Bloque crema (Figma): la banda con arcos arranca a mitad de «Sobre el edificio»
        y el crema sigue por puntos de interés y restaurantes. En mobile, crema liso.
      */}
      <div className="relative isolate overflow-hidden">
        <BrandWaveBand className="pointer-events-none absolute left-[calc(50%-979px)] top-[186px] -z-10 hidden h-[770px] w-[2142px] text-tr-cream lg:block" />
        <span
          className="pointer-events-none absolute inset-x-0 bottom-0 top-[586px] -z-10 hidden bg-tr-cream lg:block"
          aria-hidden
        />

      {/* Sobre el edificio + mapa */}
      <section data-reveal className="px-6 pb-12 pt-12 lg:px-16 lg:pt-14">
        <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[1fr_1.35fr] lg:items-center lg:gap-14">
          <div>
            <h2 className={headingClass}>
              <FormattedText value={property.aboutTitle || t.aboutTitle} as="inline" />
            </h2>
            <FormattedText
              value={property.about}
              className="mt-4 block max-w-[440px] text-[13px] leading-relaxed text-tr-ink"
            />
            <Link
              href={bookingRoute}
              {...reservasLinkProps(bookingRoute)}
              className="mt-5 inline-flex h-9 items-center rounded-[2px] bg-tr-ink px-4 text-[12px] font-medium text-white transition hover:bg-black"
            >
              {t.checkAvailability} →
            </Link>
          </div>
          <PropertyMap
            address={property.address}
            neighborhood={property.neighborhood}
            city={property.city}
          />
        </div>
      </section>

      {/* Puntos de interés + restaurantes sobre crema */}
      {poiPlaces.length > 0 || property.restaurants.length > 0 ? (
        <section data-reveal className="bg-tr-cream px-6 py-12 lg:bg-transparent lg:px-16 lg:pb-16 lg:pt-6">
          <div className="mx-auto max-w-[1440px]">
            {poiPlaces.length > 0 ? (
              <>
                <h2 className={headingClass}>
                  <FormattedText value={t.poiTitle} as="inline" />
                </h2>
                <ul className="mt-6 grid grid-cols-2 gap-x-8 gap-y-6 lg:grid-cols-4 lg:gap-x-12">
                  {poiPlaces.map((place) => (
                    <li key={place.name}>
                      <p className="flex items-center gap-2 text-[12px] text-tr-ink">
                        {poiHasImages ? null : (
                          <span className="h-1.5 w-1.5 rounded-full bg-tr-green" aria-hidden />
                        )}
                        {place.name}
                      </p>
                      {place.imageSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={place.imageSrc}
                          alt=""
                          loading="lazy"
                          className="mt-1.5 aspect-[300/80] w-full rounded-[4px] object-cover"
                        />
                      ) : null}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            {property.restaurants.length > 0 ? (
              <div className={poiPlaces.length > 0 ? "mt-12" : ""}>
                <h3 className="text-[14px] font-semibold text-tr-ink">
                  {property.restaurantsTitle || t.restaurants}
                </h3>
                <ul className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-x-12">
                  {property.restaurants.map((name, index) => (
                    <li
                      key={name}
                      className={`flex h-10 items-center rounded-[3px] px-4 text-[12px] text-white ${RESTAURANT_COLORS[index % RESTAURANT_COLORS.length]}`}
                    >
                      {name}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}
      </div>

      {property.highlightTitle ? (
        <section data-reveal className="bg-tr-ink px-6 py-6 text-white lg:px-16">
          <div className="mx-auto max-w-[1440px]">
            <p className="text-[14px] font-medium">
              <span aria-hidden>✦ </span>
              <FormattedText value={property.highlightTitle} as="inline" />
            </p>
            {property.highlightText ? (
              <FormattedText
                value={property.highlightText}
                className="mt-1 block text-[11px] text-white/60"
              />
            ) : null}
          </div>
        </section>
      ) : null}

      {/* Unidades */}
      {property.units.length > 0 ? (
        <section data-reveal className="px-6 py-12 lg:px-16 lg:py-14">
          <div className="mx-auto max-w-[1440px]">
            <h2 className={headingClass}>
              <FormattedText value={t.unitsTitle} as="inline" />
            </h2>
            {property.unitsIntro || unitsSummary ? (
              <p className="mt-1 text-[12px] text-tr-ink">{property.unitsIntro || unitsSummary}</p>
            ) : null}
            <ul className="mt-6 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {property.units.map((unit) => (
                <li key={unit.name}>
                  <div className="rounded-[4px] bg-[#111111] px-5 py-5 text-white">
                    <h3 className="text-[14px] font-semibold">{unit.name}</h3>
                    <p className="mt-2 text-[12px] text-white/85">
                      {[unit.sqm, unit.guests].filter(Boolean).join(" · ")}
                    </p>
                    {unit.features ? (
                      <p className="text-[12px] text-white/85">{unit.features}</p>
                    ) : null}
                    <div className="mt-4 flex flex-wrap gap-3">
                      {/* Lleva al motor de la torre (no a la unidad puntual) */}
                      <Link
                        href={bookingRoute}
                        {...reservasLinkProps(bookingRoute)}
                        className="inline-flex h-8 min-w-[140px] items-center justify-center rounded-[2px] bg-tr-sky px-4 text-[11px] font-medium text-tr-ink transition hover:brightness-95"
                      >
                        {t.checkUnit} →
                      </Link>
                      {unit.tourUrl ? (
                        <a
                          href={unit.tourUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-8 min-w-[120px] items-center justify-center rounded-[2px] border border-white/80 px-4 text-[11px] font-medium text-white transition hover:bg-white hover:text-tr-ink"
                        >
                          {ui.properties.tour360}
                        </a>
                      ) : null}
                    </div>
                  </div>
                  {unit.imageSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={unit.imageSrc}
                      alt=""
                      loading="lazy"
                      className="mt-3 aspect-[420/100] w-full rounded-[4px] object-cover"
                    />
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* Amenities */}
      {property.amenities.length > 0 ? (
        <section data-reveal className="px-6 pb-14 pt-4 lg:px-16">
          <div className="mx-auto max-w-[1440px]">
            <h2 className={headingClass}>
              <FormattedText value={t.amenitiesTitle} as="inline" />
            </h2>
            {property.amenitiesIntro ? (
              <FormattedText
                value={property.amenitiesIntro}
                className="mt-1 block text-[12px] text-tr-ink/70"
              />
            ) : null}
            <PropertyAmenities amenities={property.amenities} />
          </div>
        </section>
      ) : null}

      <PropertyDetailGroupsSection
        headline={property.groupsHeadline}
        description={property.groupsDescription}
        ctaLabel={property.groupsCtaLabel}
        ctaHref={property.groupsCtaHref}
        stats={property.stats}
      />

      {/* Opiniones (no están en el Figma; pedido del cliente) */}
      <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
        <PropertyReviewsSection
          propertySlug={property.slug}
          propertyName={property.name}
          reviews={reviews}
        />
        {property.elfsightReviewsAppId ? (
          <div className="mt-16">
            <ElfsightGoogleReviews
              appId={property.elfsightReviewsAppId}
              title={ui.googleReviews.title}
              className="border-0 px-0 py-0"
            />
          </div>
        ) : null}
      </div>

      {related.length > 0 ? (
        <section data-reveal className="px-6 py-14 lg:px-16">
          <div className="mx-auto max-w-[1440px]">
            <div className="flex items-end justify-between gap-4">
              <h2 className={headingClass}>
                <FormattedText value={t.relatedTitle} as="inline" />
              </h2>
              <Link href="/propiedades" className="shrink-0 text-[12px] text-tr-ink hover:underline">
                {t.seeAll}
              </Link>
            </div>
            <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-5">
              {related.slice(0, 5).map((p) => (
                <li key={p.slug}>
                  <HomeFeaturedPropertyCard property={p} href={`/propiedades/${p.slug}`} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* Franja final roja (misma estética en todos los edificios) */}
      <section data-reveal className="relative bg-tr-red px-6 py-12 text-white lg:px-16 lg:py-14">
        <span
          className="pointer-events-none absolute bottom-10 left-[4.5%] hidden h-3 w-12 bg-tr-amber lg:block"
          aria-hidden
        />
        <div className="mx-auto flex max-w-[1440px] flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div className="max-w-2xl">
            <h2 className="tr-heading text-[clamp(1.25rem,2vw,1.6rem)] !text-white [&_em]:text-[1.25em]">
              <FormattedText value={property.finalCtaTitle} as="inline" />
            </h2>
            {property.finalCtaSubtitle ? (
              <p className="mt-2 text-[13px] text-white/85">{property.finalCtaSubtitle}</p>
            ) : null}
          </div>
          <Link
            href={property.finalCtaHref}
            {...reservasLinkProps(property.finalCtaHref)}
            className="inline-flex h-10 shrink-0 items-center justify-center self-start rounded-[2px] bg-tr-sky px-6 text-[12px] font-medium text-tr-ink transition hover:brightness-95 lg:self-center"
          >
            {property.finalCtaLabel
              ? `${property.finalCtaLabel.replace(/\s*→\s*$/, "")} →`
              : t.bookNow}
          </Link>
        </div>
      </section>

      {whatsappUrl ? <WhatsAppFab url={whatsappUrl} /> : null}
    </main>
  );
}
