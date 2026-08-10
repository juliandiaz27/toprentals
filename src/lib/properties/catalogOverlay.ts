import type {
  PropertiesCatalogEnOverlay,
  PropertyDetailStored,
  PropertyListingStored,
  PropertyStatStored,
  PropertyUnitStored,
} from "./catalogTypes";

function valuesEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function mergeDetailOverlay(
  base: PropertyDetailStored | undefined,
  overlay: PropertyDetailStored | undefined,
): PropertyDetailStored | undefined {
  if (!overlay) return base;
  if (!base) return overlay;

  const merged: PropertyDetailStored = { ...base, ...overlay };

  if (overlay.stats?.length) {
    merged.stats = mergeStatsByIndex(base.stats, overlay.stats);
  }
  if (overlay.units?.length) {
    merged.units = mergeUnitsByIndex(base.units, overlay.units);
  }

  return merged;
}

function mergeStatsByIndex(
  base: PropertyStatStored[] | undefined,
  overlay: PropertyStatStored[],
): PropertyStatStored[] {
  const esArr = base ?? [];
  return esArr.map((stat, i) => {
    const o = overlay[i];
    if (o?.label) {
      return { ...stat, label: o.label };
    }
    return stat;
  });
}

function mergeUnitsByIndex(
  base: PropertyUnitStored[] | undefined,
  overlay: PropertyUnitStored[],
): PropertyUnitStored[] {
  const esArr = base ?? [];
  return esArr.map((unit, i) => {
    const o = overlay[i];
    if (!o) return unit;
    return {
      ...unit,
      ...(o.name ? { name: o.name } : {}),
      ...(o.sqm ? { sqm: o.sqm } : {}),
      ...(o.guests ? { guests: o.guests } : {}),
      ...(o.features ? { features: o.features } : {}),
    };
  });
}

export function mergeListingWithOverlay(
  base: PropertyListingStored,
  overlay: Partial<PropertyListingStored> & { slug: string },
): PropertyListingStored {
  const merged: PropertyListingStored = {
    ...base,
    ...(overlay.name !== undefined ? { name: overlay.name } : {}),
    ...(overlay.neighborhood !== undefined
      ? { neighborhood: overlay.neighborhood }
      : {}),
    ...(overlay.address !== undefined ? { address: overlay.address } : {}),
  };

  if (overlay.detail) {
    merged.detail = mergeDetailOverlay(base.detail, overlay.detail);
  }

  return merged;
}

export function mergeCatalogListings(
  spanish: PropertyListingStored[],
  overlay: PropertiesCatalogEnOverlay,
): PropertyListingStored[] {
  const bySlug = new Map(
    (overlay.properties ?? []).map((p) => [p.slug, p]),
  );
  return spanish.map((listing) => {
    const partial = bySlug.get(listing.slug);
    if (!partial) return listing;
    return mergeListingWithOverlay(listing, partial);
  });
}

function buildStatsOverlay(
  es: PropertyStatStored[] | undefined,
  draft: PropertyStatStored[] | undefined,
): PropertyStatStored[] | undefined {
  const esArr = es ?? [];
  const draftArr = draft ?? [];
  const out: PropertyStatStored[] = [];
  let hasDiff = false;
  for (let i = 0; i < draftArr.length; i++) {
    const esLabel = esArr[i]?.label ?? "";
    const draftLabel = draftArr[i]?.label ?? "";
    if (draftLabel !== esLabel) {
      hasDiff = true;
      out[i] = { value: "", label: draftLabel };
    }
  }
  return hasDiff ? out : undefined;
}

function buildUnitsOverlay(
  es: PropertyUnitStored[] | undefined,
  draft: PropertyUnitStored[] | undefined,
): PropertyUnitStored[] | undefined {
  const esArr = es ?? [];
  const draftArr = draft ?? [];
  const out: PropertyUnitStored[] = [];
  let hasDiff = false;
  for (let i = 0; i < draftArr.length; i++) {
    const esUnit = esArr[i];
    const draftUnit = draftArr[i];
    if (!draftUnit) continue;
    const partial: PropertyUnitStored = {
      name: "",
      sqm: "",
      guests: "",
      features: "",
    };
    let unitDiff = false;
    if ((draftUnit.name ?? "") !== (esUnit?.name ?? "")) {
      partial.name = draftUnit.name;
      unitDiff = true;
    }
    if ((draftUnit.sqm ?? "") !== (esUnit?.sqm ?? "")) {
      partial.sqm = draftUnit.sqm;
      unitDiff = true;
    }
    if ((draftUnit.guests ?? "") !== (esUnit?.guests ?? "")) {
      partial.guests = draftUnit.guests;
      unitDiff = true;
    }
    if ((draftUnit.features ?? "") !== (esUnit?.features ?? "")) {
      partial.features = draftUnit.features;
      unitDiff = true;
    }
    if (unitDiff) {
      hasDiff = true;
      // Solo claves distintas: evita pisar ES con strings vacíos al mergear.
      const sparse: PropertyUnitStored = {
        name: partial.name,
        sqm: partial.sqm,
        guests: partial.guests,
        features: partial.features,
      };
      out[i] = sparse;
    }
  }
  return hasDiff ? out : undefined;
}

function buildDetailOverlay(
  es: PropertyDetailStored | undefined,
  draft: PropertyDetailStored | undefined,
): PropertyDetailStored | undefined {
  if (!draft) {
    return es ? undefined : undefined;
  }

  const partial: PropertyDetailStored = {};
  let hasDiff = false;

  const textFields = [
    "subtitle",
    "about",
    "groupsHeadline",
    "groupsDescription",
    "groupsCtaLabel",
  ] as const;

  for (const key of textFields) {
    const draftVal = draft[key] ?? "";
    const esVal = es?.[key] ?? "";
    if (draftVal !== esVal) {
      partial[key] = draftVal || undefined;
      hasDiff = true;
    }
  }

  if (!valuesEqual(draft.tags ?? [], es?.tags ?? [])) {
    partial.tags = draft.tags;
    hasDiff = true;
  }
  if (!valuesEqual(draft.poiLines ?? [], es?.poiLines ?? [])) {
    partial.poiLines = draft.poiLines;
    hasDiff = true;
  }

  const statsOverlay = buildStatsOverlay(es?.stats, draft.stats);
  if (statsOverlay) {
    partial.stats = statsOverlay;
    hasDiff = true;
  }

  const unitsOverlay = buildUnitsOverlay(es?.units, draft.units);
  if (unitsOverlay) {
    partial.units = unitsOverlay;
    hasDiff = true;
  }

  return hasDiff ? partial : undefined;
}

export function buildListingTextOverlay(
  spanish: PropertyListingStored,
  draft: PropertyListingStored,
): (Partial<PropertyListingStored> & { slug: string }) | null {
  const partial: Partial<PropertyListingStored> & { slug: string } = {
    slug: draft.slug,
  };
  let hasDiff = false;

  if ((draft.name ?? "") !== (spanish.name ?? "")) {
    partial.name = draft.name;
    hasDiff = true;
  }
  if ((draft.neighborhood ?? "") !== (spanish.neighborhood ?? "")) {
    partial.neighborhood = draft.neighborhood;
    hasDiff = true;
  }
  if ((draft.address ?? "") !== (spanish.address ?? "")) {
    partial.address = draft.address;
    hasDiff = true;
  }

  const detailOverlay = buildDetailOverlay(spanish.detail, draft.detail);
  if (detailOverlay) {
    partial.detail = detailOverlay;
    hasDiff = true;
  }

  return hasDiff ? partial : null;
}

export function buildCatalogEnglishOverlay(
  spanishListings: PropertyListingStored[],
  draftListings: PropertyListingStored[],
): PropertiesCatalogEnOverlay {
  const spanishBySlug = new Map(spanishListings.map((p) => [p.slug, p]));
  const properties: PropertiesCatalogEnOverlay["properties"] = [];

  for (const draft of draftListings) {
    const spanish = spanishBySlug.get(draft.slug);
    if (!spanish) continue;
    const entry = buildListingTextOverlay(spanish, draft);
    if (entry) properties.push(entry);
  }

  return { properties };
}
