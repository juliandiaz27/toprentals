import type { PropertyCity } from "./catalog";

/** Dirección completa para búsqueda en mapas (Google Maps embed / enlace). */
export function buildPropertyMapQuery(
  address: string,
  neighborhood: string,
  city: PropertyCity,
): string {
  const country =
    city === "Quito" || city.toLowerCase().includes("ecuador")
      ? "Ecuador"
      : "Argentina";
  const parts = [address, neighborhood, city, country].filter(Boolean);
  return parts.join(", ");
}

export function googleMapsEmbedUrl(query: string): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&hl=es&z=15&output=embed`;
}

export function googleMapsOpenUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
