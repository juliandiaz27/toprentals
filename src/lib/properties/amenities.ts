/**
 * Amenities de la ficha: texto libre (uno por línea en el admin), tal como lo nombra
 * cada edificio («Piscina con jardín», «Gym con vistas»…). El ícono se elige por palabra clave.
 */
export const AMENITY_ICON_KEYS = [
  "piscina",
  "spa",
  "gimnasio",
  "sum",
  "cowork",
  "lavanderia",
  "limpieza",
  "wifi",
  "cocheras",
  "seguridad",
  "solarium",
  "terraza",
  "recepcion",
  "tv",
  "mascotas",
  "comida",
  "desayuno",
  "traslados",
  "lobby",
  "juegos",
  "aire",
  "generico",
] as const;
export type AmenityIconKey = (typeof AMENITY_ICON_KEYS)[number];

/** Primera regla que coincide gana (orden importa: «sum» antes que «sala», etc.). */
const ICON_RULES: [RegExp, AmenityIconKey][] = [
  [/piscina|pileta|pool/i, "piscina"],
  [/spa|sauna/i, "spa"],
  [/gym|gimnasio|fitness/i, "gimnasio"],
  [/\bsum\b|sala de reuni|salas de reuni|meeting/i, "sum"],
  [/cowork/i, "cowork"],
  [/lavander|laundry/i, "lavanderia"],
  [/limpieza|housekeeping|mucama/i, "limpieza"],
  [/wi-?fi/i, "wifi"],
  [/cochera|estacionamiento|parking|garage/i, "cocheras"],
  [/seguridad|security/i, "seguridad"],
  [/solarium/i, "solarium"],
  [/rooftop|terraza|terrace/i, "terraza"],
  [/recepci|concierge|conserje/i, "recepcion"],
  [/\btv\b|televis/i, "tv"],
  [/pet|mascota/i, "mascotas"],
  [/desayuno|breakfast/i, "desayuno"],
  [/comida|restaurant|food/i, "comida"],
  [/traslado|aeropuerto|airport|transfer/i, "traslados"],
  [/lobby/i, "lobby"],
  [/playroom|juegos|kids/i, "juegos"],
  [/a\/c|aire acondicionado|fr[ií]o.?calor/i, "aire"],
];

export function amenityIconKey(label: string): AmenityIconKey {
  return ICON_RULES.find(([re]) => re.test(label))?.[1] ?? "generico";
}

/** IDs que se guardaban antes (casillas) → nombre visible. */
const LEGACY_AMENITY_LABELS: Record<string, string> = {
  piscina: "Piscina",
  spa: "Spa / Sauna",
  solarium: "Solarium",
  gimnasio: "Fitness Center",
  sum: "SUM · Sala de Reuniones",
  lavanderia: "Lavandería",
  limpieza: "Limpieza",
  wifi: "WiFi",
  cocheras: "Cocheras",
  seguridad: "Seguridad 24hs",
  cowork: "Cowork",
  terraza: "Terraza",
  recepcion: "Recepción 24/7",
};

export function normalizeAmenities(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => String(item ?? "").trim())
    .filter(Boolean)
    .map((item) => LEGACY_AMENITY_LABELS[item] ?? item);
}

/**
 * Punto de interés: «Nombre» o «Nombre | url-de-foto» (una línea por lugar en el admin).
 */
export function parsePoiLine(line: string): { name: string; imageSrc: string } {
  const [name = "", imageSrc = ""] = String(line ?? "").split("|");
  return { name: name.trim(), imageSrc: imageSrc.trim() };
}
