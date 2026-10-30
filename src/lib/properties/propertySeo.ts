import { plainTextFromRichHtml } from "@/lib/richText/sanitize";
import { absoluteUrl, SITE_URL } from "@/lib/seo";
import type { PropertyDetail } from "./details";

/** Nombre limpio para buscadores: sin «Top Rentals» adelante y sin etiquetas. */
function cleanName(property: PropertyDetail): string {
  const banner = plainTextFromRichHtml(property.bannerTitle || "").trim();
  const base = banner || property.name;
  return base.replace(/^Top Rentals\s+/i, "").trim() || property.name;
}

function place(property: PropertyDetail): string {
  return [property.neighborhood, property.city].filter(Boolean).join(", ");
}

/**
 * «Núñez Hub — Departamentos temporarios en Núñez, Buenos Aires»; si pasa de ~60 caracteres
 * (lo que muestra Google) se acorta a «… — Alquiler temporario en Núñez».
 */
export function propertySeoTitle(property: PropertyDetail): string {
  if (property.seoTitle) return property.seoTitle;
  const name = cleanName(property);
  const where = place(property);
  const long = `${name} — Departamentos temporarios${where ? ` en ${where}` : ""}`;
  if (long.length <= 60) return long;
  const area = property.neighborhood || property.city;
  return `${name} — Alquiler temporario${area ? ` en ${area}` : ""}`;
}

export function propertySeoDescription(property: PropertyDetail): string {
  if (property.seoDescription) return property.seoDescription;
  const about = plainTextFromRichHtml(property.about || "").trim();
  if (about) return about;
  return `Departamentos temporarios con servicio de hotel en ${place(property) || property.city}. Reservá directo con Top Rentals.`;
}

/** Primera foto real (las de relleno no sirven para compartir el link). */
export function propertyImage(property: PropertyDetail): string {
  return (
    [property.bannerImage, ...property.galleryImages, property.imageSrc].find(
      (src) => src && !/placeholder/i.test(src),
    ) ?? ""
  );
}

const COUNTRY: Record<string, string> = { "Buenos Aires": "AR", Quito: "EC" };

/** Datos estructurados de la ficha: alojamiento + migas de pan. */
export function propertyJsonLd(property: PropertyDetail) {
  const url = absoluteUrl(`/propiedades/${property.slug}`);
  const images = [propertyImage(property), ...property.galleryImages]
    .filter((src) => src && !/placeholder/i.test(src))
    .filter((src, i, all) => all.indexOf(src) === i)
    .slice(0, 6)
    .map(absoluteUrl);

  return [
    {
      "@context": "https://schema.org",
      "@type": "LodgingBusiness",
      "@id": `${url}#lodging`,
      name: cleanName(property),
      description: propertySeoDescription(property),
      url,
      ...(images.length ? { image: images } : {}),
      brand: { "@id": `${SITE_URL}/#organization` },
      address: {
        "@type": "PostalAddress",
        ...(property.address ? { streetAddress: property.address } : {}),
        ...(property.neighborhood ? { addressLocality: property.neighborhood } : {}),
        addressRegion: property.city,
        addressCountry: COUNTRY[property.city] ?? "AR",
      },
      ...(property.amenities.length
        ? {
            amenityFeature: property.amenities.map((name) => ({
              "@type": "LocationFeatureSpecification",
              name,
              value: true,
            })),
          }
        : {}),
      ...(property.units.length
        ? {
            containsPlace: property.units.map((unit) => ({
              "@type": "Accommodation",
              name: unit.name,
              ...(unit.sqm ? { floorSize: { "@type": "QuantitativeValue", description: unit.sqm } } : {}),
              ...(unit.guests ? { occupancy: { "@type": "QuantitativeValue", description: unit.guests } } : {}),
            })),
          }
        : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "Propiedades", item: absoluteUrl("/propiedades") },
        { "@type": "ListItem", position: 3, name: cleanName(property), item: url },
      ],
    },
  ];
}
