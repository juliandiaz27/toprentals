/**
 * Establecimientos Top Rentals — PDF GNAHS dic. 2025.
 * En widget/motor usar solo `id` 1–11 en `establishments`.
 */
export const GNAHS_HOTELS = [
  { id: 1, name: "Top Rentals Dorrego" },
  { id: 2, name: "Top Rentals WOW Nuñez" },
  { id: 3, name: "Top Rentals Palermo Soho" },
  { id: 4, name: "Top Rentals Qorner" },
  { id: 5, name: "Top Rentals Montañeses" },
  { id: 6, name: "Top Rentals Palermo Chico" },
  { id: 7, name: "Top Rentals Palermo Hollywood" },
  { id: 8, name: "Top Rentals Huergo" },
  { id: 9, name: "Top Rentals Belgrano" },
  { id: 10, name: "Top Rentals Downtown" },
  { id: 11, name: "Top Rentals Torre Nuñez" },
  /** Ecuador — motor Quito (`engine-quito.html`). */
  { id: 12, name: "Top Rentals Quito", city: "Quito" as const },
] as const;

export const GNAHS_HOTEL_IDS = GNAHS_HOTELS.map((h) => h.id);
