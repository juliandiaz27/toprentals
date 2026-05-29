/**
 * Establecimientos Top Rentals — PDF GNAHS «Integración motor» (dic. 2025).
 * En widget/motor se usan los `id` (1–11), no los códigos PMS del mail anterior.
 */
export const GNAHS_HOTELS = [
  { id: 1, name: "Top Rentals Dorrego", pmsCode: 1294 },
  { id: 2, name: "Top Rentals WOW Nuñez", pmsCode: 1295 },
  { id: 3, name: "Top Rentals Palermo Soho", pmsCode: 1296 },
  { id: 4, name: "Top Rentals Qorner", pmsCode: 1297 },
  { id: 5, name: "Top Rentals Montañeses", pmsCode: 1298 },
  { id: 6, name: "Top Rentals Palermo Chico", pmsCode: 1299 },
  { id: 7, name: "Top Rentals Palermo Hollywood", pmsCode: 1300 },
  { id: 8, name: "Top Rentals Huergo", pmsCode: 1301 },
  { id: 9, name: "Top Rentals Belgrano", pmsCode: 1302 },
  { id: 10, name: "Top Rentals Downtown", pmsCode: 1303 },
  { id: 11, name: "Top Rentals Torre Nuñez", pmsCode: 1304 },
] as const;

export const GNAHS_HOTEL_IDS = GNAHS_HOTELS.map((h) => h.id);

/** Códigos PMS (referencia; no van en BookingParams ni en el widget). */
export const GNAHS_HOTEL_PMS_CODES = GNAHS_HOTELS.map((h) => h.pmsCode);
