import Link from "next/link";
import type { PropertyDetail } from "@/lib/properties/details";
import { getRelatedProperties } from "@/lib/properties/details";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { PropertyDetailHero } from "@/components/properties/detail/PropertyDetailHero";

type Props = {
  property: PropertyDetail;
  whatsappUrl?: string;
};

export function PropertyDetailView({ property, whatsappUrl }: Props) {
  const related = getRelatedProperties(property.relatedSlugs, property.slug);

  return (
    <main className="bg-white">
      <PropertyDetailHero property={property} whatsappUrl={whatsappUrl} />

      <div className="mx-auto max-w-[1440px] px-6 pb-16 pt-10 lg:px-12 lg:pt-12">
        <div
          data-reveal
          className="grid gap-3 rounded-lg border border-neutral-200 bg-white p-4 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] lg:items-end lg:gap-4"
        >
          {[
            { label: "ENTRADA", placeholder: "Fecha" },
            { label: "SALIDA", placeholder: "Fecha" },
            { label: "HUÉSPEDES", placeholder: "2 adultos" },
            { label: "TIPO", placeholder: "Unidad" },
          ].map((field) => (
            <div key={field.label}>
              <label className="text-[11px] font-semibold tracking-wide text-neutral-500">
                {field.label}
              </label>
              <div className="mt-1 rounded border border-neutral-200 px-3 py-2.5 text-[14px] text-neutral-400">
                {field.placeholder}
              </div>
            </div>
          ))}
          <Link
            href="/reservas"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-neutral-950 px-8 text-[14px] font-medium text-white hover:bg-neutral-800 lg:h-[42px] lg:self-end"
          >
            Reservar
          </Link>
        </div>

        <div
          data-reveal
          className="mt-10 grid gap-3 lg:grid-cols-[1.2fr_1fr] lg:grid-rows-2 lg:gap-4"
        >
          {property.imageSrc ? (
            <>
              <div className="relative min-h-[280px] overflow-hidden rounded-lg bg-neutral-200 lg:row-span-2 lg:min-h-[360px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={property.imageSrc}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <div className="relative min-h-[160px] overflow-hidden rounded-lg bg-neutral-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={property.imageSrc}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <div className="relative min-h-[160px] overflow-hidden rounded-lg bg-neutral-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={property.imageSrc}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            </>
          ) : (
            <>
              <div className="min-h-[280px] rounded-lg bg-neutral-200 lg:row-span-2 lg:min-h-[360px]" />
              <div className="min-h-[160px] rounded-lg bg-neutral-200" />
              <div className="min-h-[160px] rounded-lg bg-neutral-200" />
            </>
          )}
        </div>

        <section data-reveal className="mt-16 grid gap-10 lg:grid-cols-2 lg:gap-12">
          <div>
            <h2 className="text-xl font-bold text-neutral-950">Sobre el edificio</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-neutral-600">
              {property.about}
            </p>
            <ul className="mt-8 flex flex-wrap gap-x-4 gap-y-2 text-[14px] text-neutral-600">
              {property.poi.map((place) => (
                <li key={place}>{place}</li>
              ))}
            </ul>
          </div>
          <div className="flex min-h-[280px] items-center justify-center rounded-lg bg-neutral-200 lg:min-h-[320px]">
            <span className="text-[13px] text-neutral-500">[ Mapa ]</span>
          </div>
        </section>

        <section data-reveal className="mt-16">
          <h2 className="text-xl font-bold text-neutral-950">Unidades disponibles</h2>
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
                <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                  <Link
                    href="/reservas"
                    className="inline-flex h-10 flex-1 items-center justify-center rounded-lg bg-neutral-950 text-[13px] font-medium text-white hover:bg-neutral-800"
                  >
                    Ver disponibilidad
                  </Link>
                  <button
                    type="button"
                    className="inline-flex h-10 flex-1 items-center justify-center rounded-lg border border-neutral-950 text-[13px] font-medium text-neutral-950 hover:bg-neutral-50"
                  >
                    Tour 360°
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section data-reveal className="bg-neutral-950 px-6 py-10 text-white lg:px-12">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-lg font-semibold lg:text-xl">{property.groupsHeadline}</p>
          <Link
            href={property.groupsCtaHref}
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-lg bg-white px-6 text-[14px] font-medium text-neutral-950 hover:bg-neutral-100"
          >
            {property.groupsCtaLabel}
          </Link>
        </div>
        <ul className="mx-auto mt-10 grid max-w-[1440px] grid-cols-2 gap-8 lg:grid-cols-4">
          {property.stats.map((stat) => (
            <li key={stat.label}>
              <p className="text-[clamp(2rem,4vw,3rem)] font-bold leading-none">
                {stat.value}
              </p>
              <p className="mt-2 text-[14px] text-neutral-400">{stat.label}</p>
            </li>
          ))}
        </ul>
      </section>

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

      <section data-reveal className="bg-neutral-950 px-6 py-10 lg:px-12">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-lg font-semibold text-white lg:text-xl">
            {property.finalCtaTitle}
          </p>
          <Link
            href={property.finalCtaHref}
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-lg bg-white px-6 text-[14px] font-medium text-neutral-950 hover:bg-neutral-100"
          >
            Reservar ahora
          </Link>
        </div>
      </section>

    </main>
  );
}
