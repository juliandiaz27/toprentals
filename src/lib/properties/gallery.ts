import type { PropertyDetail } from "./propertyDetailTypes";

/** Imágenes de la galería de ficha; si no hay, usa la imagen de listado. */
export function resolvePropertyGalleryImages(
  imageSrc: string,
  galleryImages?: string[],
): string[] {
  const fromGallery = (galleryImages ?? []).map((s) => s.trim()).filter(Boolean);
  if (fromGallery.length > 0) return fromGallery;
  if (imageSrc.trim()) return [imageSrc.trim()];
  return [];
}

export function galleryFromDetail(
  property: Pick<PropertyDetail, "imageSrc" | "galleryImages">,
): string[] {
  return resolvePropertyGalleryImages(property.imageSrc, property.galleryImages);
}
