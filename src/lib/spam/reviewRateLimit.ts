import { readPropertyReviews } from "@/lib/properties/reviewsStorage";

const MAX_REVIEWS_PER_HOUR = 8;
const MAX_PER_PROPERTY_PER_HOUR = 3;

export async function assertPropertyReviewRateLimit(
  propertySlug: string,
): Promise<string | null> {
  const reviews = await readPropertyReviews();
  const since = Date.now() - 60 * 60 * 1000;

  const recent = reviews.filter(
    (r) => new Date(r.createdAt).getTime() >= since,
  );
  if (recent.length >= MAX_REVIEWS_PER_HOUR) {
    return "Recibimos muchos comentarios. Probá de nuevo más tarde.";
  }

  const recentForProperty = recent.filter((r) => r.propertySlug === propertySlug);
  if (recentForProperty.length >= MAX_PER_PROPERTY_PER_HOUR) {
    return "Ya recibimos varios comentarios para esta propiedad. Intentá más tarde.";
  }

  return null;
}
