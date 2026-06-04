import { GNAHS_HOTELS } from "@/lib/gnahs/hotels";
import { readPropertiesCatalog } from "./catalogStorage";
import type { PropertyListingStored } from "./catalogTypes";

export type PropertiesCatalogEditorState = {
  listings: PropertyListingStored[];
  featuredSlugs: string[];
  gnahsOptions: { id: number; name: string }[];
};

export async function loadPropertiesCatalogEditorState(): Promise<PropertiesCatalogEditorState> {
  const catalog = await readPropertiesCatalog();
  return {
    listings: catalog.listings,
    featuredSlugs: catalog.featuredSlugs,
    gnahsOptions: GNAHS_HOTELS.map((h) => ({ id: h.id, name: h.name })),
  };
}
