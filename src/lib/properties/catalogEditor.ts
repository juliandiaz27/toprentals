import { GNAHS_HOTELS } from "@/lib/gnahs/hotels";
import { pickPropiedadesFilters } from "@/lib/pageContent/propiedadesTypes";
import { propertyCityOptionsFromFilters } from "@/lib/pageContent/propertyCityFilters";
import { readPageContent } from "@/lib/pageContent/storage";
import type { SiteLanguage } from "@/lib/i18n";
import { readPropertiesCatalog } from "./catalogStorage";
import type { PropertyListingStored } from "./catalogTypes";

export type PropertiesCatalogEditorState = {
  listings: PropertyListingStored[];
  featuredSlugs: string[];
  gnahsOptions: { id: number; name: string }[];
  cityOptions: string[];
};

export async function loadPropertiesCatalogEditorState(
  language?: SiteLanguage,
): Promise<PropertiesCatalogEditorState> {
  const [catalog, propContent] = await Promise.all([
    readPropertiesCatalog(language),
    readPageContent("propiedades"),
  ]);
  const filters = pickPropiedadesFilters(propContent);
  const cityOptions = propertyCityOptionsFromFilters(filters);

  return {
    listings: catalog.listings,
    featuredSlugs: catalog.featuredSlugs,
    gnahsOptions: GNAHS_HOTELS.map((h) => ({ id: h.id, name: h.name })),
    cityOptions:
      cityOptions.length > 0 ? cityOptions : ["Buenos Aires", "Quito"],
  };
}
