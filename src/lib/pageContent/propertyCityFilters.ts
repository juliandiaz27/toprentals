export type PropertyCityFilterItem = {
  id: string;
  label: string;
  matchCities: string[];
  /** Si true, el filtro también muestra propiedades «Próximamente» (cualquier ciudad). */
  includeComingSoon?: boolean;
};

export const PROPERTY_CITY_FILTERS_MIN = 1;
export const PROPERTY_CITY_FILTERS_MAX = 12;

export const DEFAULT_PROPERTY_CITY_FILTERS: PropertyCityFilterItem[] = [
  {
    id: "buenos-aires",
    label: "Buenos Aires",
    matchCities: ["Buenos Aires"],
  },
  {
    id: "ecuador",
    label: "Ecuador",
    matchCities: ["Quito"],
    includeComingSoon: true,
  },
];

export function slugifyCityFilterId(label: string): string {
  const base = label
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return base || "filtro";
}

function uniqueIds(filters: PropertyCityFilterItem[]): PropertyCityFilterItem[] {
  const seen = new Set<string>();
  return filters.map((f, index) => {
    let id = f.id || slugifyCityFilterId(f.label);
    if (seen.has(id)) id = `${id}-${index + 1}`;
    seen.add(id);
    return { ...f, id };
  });
}

/** Lee `filters.items` o campos legacy `buenosAires` / `ecuador`. */
export function parsePropertyCityFilters(
  filtersRaw: Record<string, unknown>,
): PropertyCityFilterItem[] {
  const itemsRaw = filtersRaw.items;
  if (Array.isArray(itemsRaw) && itemsRaw.length > 0) {
    const parsed: PropertyCityFilterItem[] = [];
    for (const entry of itemsRaw) {
      if (!entry || typeof entry !== "object") continue;
      const row = entry as Record<string, unknown>;
      const label = String(row.label ?? "").trim();
      if (!label) continue;

      let matchCities: string[] = [];
      if (Array.isArray(row.matchCities)) {
        matchCities = row.matchCities
          .map((c) => String(c).trim())
          .filter(Boolean);
      } else {
        matchCities = String(row.matchCities ?? row.propertyCity ?? label)
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean);
      }
      if (matchCities.length === 0) matchCities = [label];

      parsed.push({
        id: String(row.id ?? slugifyCityFilterId(label)),
        label,
        matchCities,
        includeComingSoon:
          row.includeComingSoon === true || row.includeComingSoon === "true",
      });
    }
    if (parsed.length > 0) return uniqueIds(parsed);
  }

  const ba = String(filtersRaw.buenosAires ?? "Buenos Aires").trim() || "Buenos Aires";
  const ec = String(filtersRaw.ecuador ?? "Ecuador").trim() || "Ecuador";
  return DEFAULT_PROPERTY_CITY_FILTERS.map((d) =>
    d.id === "buenos-aires" ? { ...d, label: ba } : { ...d, label: ec },
  );
}

export function propertyCityOptionsFromFilters(
  filters: PropertyCityFilterItem[],
): string[] {
  const set = new Set<string>();
  for (const f of filters) {
    for (const c of f.matchCities) {
      const t = c.trim();
      if (t) set.add(t);
    }
  }
  return [...set].sort((a, b) => a.localeCompare(b, "es"));
}

export function cityDisplayLabel(
  city: string,
  filters: PropertyCityFilterItem[],
): string {
  for (const f of filters) {
    if (f.matchCities.includes(city)) return f.label;
  }
  return city;
}

export function listingMatchesCityFilter(
  filter: PropertyCityFilterItem,
  city: string,
  comingSoon?: boolean,
): boolean {
  if (filter.includeComingSoon && comingSoon) return true;
  if (!filter.matchCities.includes(city)) return false;
  if (comingSoon && !filter.includeComingSoon) return false;
  return true;
}

export function parseCityFiltersFormValue(
  raw: string,
  min: number,
  max: number,
): { ok: true; items: PropertyCityFilterItem[] } | { ok: false; error: string } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw || "[]");
  } catch {
    return { ok: false, error: "Formato de filtros inválido." };
  }
  if (!Array.isArray(parsed)) {
    return { ok: false, error: "Los filtros deben ser una lista." };
  }

  const items: PropertyCityFilterItem[] = [];
  for (const entry of parsed) {
    if (!entry || typeof entry !== "object") continue;
    const row = entry as Record<string, unknown>;
    const label = String(row.label ?? "").trim();
    if (!label) continue;
    const matchCities = String(row.matchCities ?? label)
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
    items.push({
      id: slugifyCityFilterId(label),
      label,
      matchCities: matchCities.length > 0 ? matchCities : [label],
      includeComingSoon:
        row.includeComingSoon === true || row.includeComingSoon === "true",
    });
  }

  if (items.length < min) {
    return {
      ok: false,
      error: `Agregá al menos ${min} filtro${min === 1 ? "" : "s"} de ciudad.`,
    };
  }
  if (items.length > max) {
    return { ok: false, error: `Máximo ${max} filtros.` };
  }

  return { ok: true, items: uniqueIds(items) };
}
