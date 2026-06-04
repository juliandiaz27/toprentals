import type { PropertyCity, PropertyListing } from "./catalogTypes";

export type { PropertyCity, PropertyListing };

/** Placeholders hasta recibir fotos oficiales por edificio. */
export const PROPERTY_PLACEHOLDER_IMAGES = [
  "/images/properties/placeholder-lobby.png",
  "/images/properties/placeholder-facade.png",
  "/images/properties/placeholder-building.png",
] as const;

export function propertyPlaceholderImage(index: number): string {
  return PROPERTY_PLACEHOLDER_IMAGES[
    index % PROPERTY_PLACEHOLDER_IMAGES.length
  ]!;
}

export { slugifyPropertyName } from "./slugify";
export {
  getPropertyBySlug,
  loadPropertyListings,
  loadPropertiesCatalog,
  pickHomeFeaturedProperties,
} from "./catalogLoad";
