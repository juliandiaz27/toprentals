import { GNAHS_ESTABLISHMENTS_QUITO } from "@/lib/gnahs/config";

export type BookingSearchParams = {
  checkin: string;
  checkout: string;
  adults: number;
  establishmentId?: number;
  bookingRoute?: string;
};

export function routeForEstablishment(establishmentId?: number): string {
  if (
    establishmentId &&
    (GNAHS_ESTABLISHMENTS_QUITO as readonly number[]).includes(establishmentId)
  ) {
    return "/reservas/quito";
  }
  if (establishmentId) {
    return "/reservas/buenos-aires";
  }
  return "/reservas";
}

/** URL del motor GNAHS con parámetros GET (mismo contrato que el widget oficial). */
export function buildGnahsBookingUrl({
  checkin,
  checkout,
  adults,
  establishmentId,
  bookingRoute,
}: BookingSearchParams): string {
  const base = establishmentId
    ? routeForEstablishment(establishmentId)
    : (bookingRoute ?? "/reservas");
  const q = new URLSearchParams();
  q.set("checkin", checkin);
  q.set("checkout", checkout);
  q.set("rooms", "1");
  q.set("room1_adults", String(Math.max(1, adults)));
  if (establishmentId) {
    q.set("establishment_id", String(establishmentId));
  }
  return `${base}?${q.toString()}`;
}

/** Ruta del motor con `establishment_id` fijo (el widget añade fechas y ocupación). */
export function getGnahsBookingRouteForEstablishment(
  establishmentId: number,
): string {
  const id = Math.floor(Number(establishmentId));
  if (!Number.isFinite(id) || id < 1) return "/reservas";
  const q = new URLSearchParams();
  q.set("establishment_id", String(id));
  return `${routeForEstablishment(id)}?${q.toString()}`;
}

export function parseGnahsEstablishmentId(
  raw: string | string[] | undefined,
): number | undefined {
  const value = Array.isArray(raw) ? raw[0] : raw;
  const id = Math.floor(Number(value));
  return Number.isFinite(id) && id >= 1 ? id : undefined;
}

export function formatDateForInput(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function defaultCheckinCheckout(): { checkin: string; checkout: string } {
  const checkin = new Date();
  checkin.setDate(checkin.getDate() + 1);
  const checkout = new Date(checkin);
  checkout.setDate(checkout.getDate() + 1);
  return {
    checkin: formatDateForInput(checkin),
    checkout: formatDateForInput(checkout),
  };
}
