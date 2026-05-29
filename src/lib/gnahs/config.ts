import { GNAHS_HOTEL_IDS } from "./hotels";

/** Alias API WordPress / PDF GNAHS — `hostalric` → hostalric.gnahs.app */
export const GNAHS_API_ALIAS = "hostalric";

/** Slug cliente Top Rentals (mis reservas: …/top-rentals) */
export const GNAHS_CLIENT_SLUG =
  process.env.NEXT_PUBLIC_GNAHS_CLIENT_SLUG ?? "top-rentals";

/** IDs de establecimiento — PDF dic. 2025: establishment_id [1..11] */
export const GNAHS_ENGINE_ESTABLISHMENTS = GNAHS_HOTEL_IDS;

export const GNAHS_UUID =  process.env.NEXT_PUBLIC_GNAHS_WIDGET_UUID ??
  "a74723e1-187c-44d3-8c2d-948c2685e77e";

export const GNAHS_API_URL =
  process.env.NEXT_PUBLIC_GNAHS_API_URL ?? "https://hostalric.gnahs.app";

export const GNAHS_ASSETS_URL =
  process.env.NEXT_PUBLIC_GNAHS_ASSETS_URL ??
  "https://hostalric.gnahs.app/dist/";

export const GNAHS_METASEARCH_TRACKER =
  "https://assets.gnahs.com/services/booking-engine/metasearch-tracker/v1/launcher.js";

export const GNAHS_RHO_INIT_SCRIPT =
  "https://assets.gnahs.com/scripts/rho-initialization/gnahs-get-rho-initial-settings-v2.js";

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

/** Parámetros del motor (#GNAHSEngine) — docs integración básica GNAHS. */
export function getGnahsEngineConfig() {
  return {
    uuid: GNAHS_UUID,
    establishments: [...GNAHS_ENGINE_ESTABLISHMENTS],
    language: "es" as const,
    api: GNAHS_API_URL,
    assets: GNAHS_ASSETS_URL,
  };
}

/** Configuración del widget / buscador (widget.html). */
export function getGnahsWidgetConfig() {
  return {
    uuid: GNAHS_UUID,
    apiUrl: GNAHS_API_URL,
    establishments: [...GNAHS_ENGINE_ESTABLISHMENTS],
    language: "es" as const,
    bookingRoute:
      process.env.NEXT_PUBLIC_GNAHS_BOOKING_ROUTE ?? "/reservas",
    saveLastSeach: false,
    appearance: { gap: 0 },
  };
}

/** Confirmación y gestión de reservas (my-booking.html). */
export function getGnahsMyBookingConfig() {
  return {
    url:
      process.env.NEXT_PUBLIC_GNAHS_MY_BOOKING_URL ??
      `${GNAHS_API_URL}/${GNAHS_CLIENT_SLUG}`,
    locale: "es" as const,
  };
}

/** Módulo de agencias (agencies.html). */
export function getGnahsAgenciesConfig() {
  return {
    uuid: GNAHS_UUID,
    locale: "es_ES" as const,
    establishments: [] as number[],
  };
}

/** Programa de fidelización (loyalty.html). */
export function getGnahsLoyaltyConfig() {
  return {
    uuid: GNAHS_UUID,
    locale: "es_ES" as const,
    establishments: [] as number[],
  };
}
