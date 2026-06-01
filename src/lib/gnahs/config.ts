/**
 * Parámetros oficiales Top Rentals — PDF GNAHS dic. 2025.
 * Establishment IDs del motor: 1–11 (no usar códigos PMS).
 */

/** IDs de establecimiento para widget y motor general (`establishment_id` del PDF). */
export const GNAHS_ESTABLISHMENT_IDS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
] as const;

/** Motor solo Buenos Aires — `engine-buenos-aires.html` de GNAHS. */
export const GNAHS_ESTABLISHMENTS_BUENOS_AIRES = [
  1, 2, 3, 5, 6, 7, 8, 9, 10, 11,
] as const;

/** Motor Quito / Ecuador — `engine-quito.html` de GNAHS (incluye id 12). */
export const GNAHS_ESTABLISHMENTS_QUITO = [4, 12] as const;

export type GnahsEngineRegion = "all" | "buenos-aires" | "quito";

export function getEstablishmentsForEngineRegion(
  region: GnahsEngineRegion,
): number[] {
  switch (region) {
    case "buenos-aires":
      return [...GNAHS_ESTABLISHMENTS_BUENOS_AIRES];
    case "quito":
      return [...GNAHS_ESTABLISHMENTS_QUITO];
    default:
      return [...GNAHS_ESTABLISHMENT_IDS];
  }
}

export const GNAHS_CLIENT_SLUG =
  process.env.NEXT_PUBLIC_GNAHS_CLIENT_SLUG ?? "top-rentals";

export const GNAHS_UUID =
  process.env.NEXT_PUBLIC_GNAHS_WIDGET_UUID ??
  "a74723e1-187c-44d3-8c2d-948c2685e77e";

export const GNAHS_API_URL =
  process.env.NEXT_PUBLIC_GNAHS_API_URL ?? "https://hostalric.gnahs.app";

export const GNAHS_ASSETS_URL =
  process.env.NEXT_PUBLIC_GNAHS_ASSETS_URL ??
  "https://hostalric.gnahs.app/dist/";

/** Sitio completo — solo en `layout.tsx`. */
export const GNAHS_METASEARCH_TRACKER =
  "https://assets.gnahs.com/services/booking-engine/metasearch-tracker/v1/launcher.js";

/** Solo en `/reservas` — paso 2 integración básica. */
export const GNAHS_RHO_INIT_SCRIPT =
  "https://assets.gnahs.com/scripts/rho-initialization/gnahs-get-rho-initial-settings-v2.js";

/** Solo en `/reservas`, después de rho-init. */
export const GNAHS_FETCH_SCRIPT =
  "https://assets.gnahs.com/scripts/booking-engine/fetch.min.js";

export const GNAHS_MY_BOOKING_LAUNCHER = `${GNAHS_API_URL}/my-booking/launcher.js`;

export const GNAHS_AGENCIES_LAUNCHER =
  "https://assets.gnahs.com/services/agencies/v1/launcher.js";

export const GNAHS_LOYALTY_LAUNCHER =
  "https://assets.gnahs.com/services/loyalty/v1/launcher.js";

export const GNAHS_WIDGET_CSS =
  "https://assets.gnahs.com/modules/booking-widget/v3/app.css";
export const GNAHS_WIDGET_JS =
  "https://assets.gnahs.com/modules/booking-widget/v3/app.js";

/** `window.BookingParams` — motor #GNAHSEngine (engine.html por región). */
export function getGnahsEngineConfig(region: GnahsEngineRegion = "all") {
  return {
    uuid: GNAHS_UUID,
    establishments: getEstablishmentsForEngineRegion(region),
    language: "es" as const,
    api: GNAHS_API_URL,
    assets: GNAHS_ASSETS_URL,
  };
}

/** Widget / buscador (widget.html). */
export function getGnahsWidgetConfig() {
  return {
    uuid: GNAHS_UUID,
    apiUrl: GNAHS_API_URL,
    establishments: [...GNAHS_ESTABLISHMENT_IDS],
    language: "es" as const,
    bookingRoute:
      process.env.NEXT_PUBLIC_GNAHS_BOOKING_ROUTE ?? "/reservas",
    saveLastSeach: false,
    appearance: { gap: 0 },
  };
}

/** My Booking (my-booking.html) — slug `top-rentals`. */
export function getGnahsMyBookingConfig() {
  return {
    url:
      process.env.NEXT_PUBLIC_GNAHS_MY_BOOKING_URL ??
      `${GNAHS_API_URL}/${GNAHS_CLIENT_SLUG}`,
    locale: "es_ES" as const,
  };
}

export function getGnahsAgenciesConfig() {
  return {
    uuid: GNAHS_UUID,
    locale: "es_ES" as const,
    establishments: [] as number[],
  };
}

export function getGnahsLoyaltyConfig() {
  return {
    uuid: GNAHS_UUID,
    locale: "es_ES" as const,
  };
}
