import type { PropertyListingStored } from "./catalogTypes";

export type CompletenessCheck = {
  label: string;
  ok: boolean;
};

export type PropertyCompleteness = {
  checks: CompletenessCheck[];
  /** 0–100 */
  score: number;
  missing: string[];
};

/**
 * Qué le falta a la ficha de un edificio para verse como en el diseño.
 * Lo usan el inicio del admin y el listado de propiedades.
 */
export function propertyCompleteness(item: PropertyListingStored): PropertyCompleteness {
  const d = item.detail ?? {};
  const units = d.units ?? [];
  const poi = (d.poiLines ?? []).filter((line) => line.trim());
  const stats = (d.stats ?? []).filter((s) => s.value.trim() && s.value.trim() !== "—");

  const checks: CompletenessCheck[] = [
    { label: "Galería (3+ fotos)", ok: (d.galleryImages ?? []).length >= 3 },
    { label: "Descripción", ok: Boolean(d.about?.trim()) },
    { label: "Unidades", ok: units.length > 0 },
    { label: "Fotos de unidades", ok: units.length > 0 && units.every((u) => u.imageSrc?.trim()) },
    { label: "Tours 360°", ok: units.length > 0 && units.every((u) => u.tourUrl?.trim()) },
    { label: "Puntos de interés", ok: poi.length >= 4 },
    { label: "Fotos de puntos de interés", ok: poi.length > 0 && poi.every((line) => line.includes("|")) },
    { label: "Amenities", ok: (d.amenities ?? []).length > 0 },
    { label: "Cifras", ok: stats.length >= 2 },
  ];

  const done = checks.filter((c) => c.ok).length;
  return {
    checks,
    score: Math.round((done / checks.length) * 100),
    missing: checks.filter((c) => !c.ok).map((c) => c.label),
  };
}
