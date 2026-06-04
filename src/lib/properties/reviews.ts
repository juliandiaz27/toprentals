import type { PropertyReview, PropertyReviewStored } from "./reviewsTypes";
import { readPropertyReviews, writePropertyReviews } from "./reviewsStorage";

export async function getVisibleReviewsForProperty(
  propertySlug: string,
): Promise<PropertyReview[]> {
  const reviews = await readPropertyReviews();
  return reviews
    .filter((r) => r.propertySlug === propertySlug && r.visible)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}

export function normalizeReviewInput(
  raw: Partial<PropertyReviewStored>,
): PropertyReviewStored | null {
  const id = String(raw.id ?? "").trim();
  const propertySlug = String(raw.propertySlug ?? "").trim();
  const authorName = String(raw.authorName ?? "").trim();
  const body = String(raw.body ?? "").trim();
  if (!id || !propertySlug || !authorName || !body) return null;

  let rating: number | undefined;
  if (typeof raw.rating === "number" && raw.rating >= 1 && raw.rating <= 5) {
    rating = Math.round(raw.rating);
  }

  const createdAt = String(raw.createdAt ?? "").trim() || new Date().toISOString();

  return {
    id,
    propertySlug,
    authorName: authorName.slice(0, 80),
    body: body.slice(0, 2000),
    rating,
    createdAt,
    visible: raw.visible === true,
  };
}

export async function appendPropertyReview(
  review: Omit<PropertyReviewStored, "id" | "createdAt" | "visible"> & {
    visible?: boolean;
  },
): Promise<PropertyReviewStored> {
  const reviews = await readPropertyReviews();
  const entry: PropertyReviewStored = {
    id: crypto.randomUUID(),
    propertySlug: review.propertySlug,
    authorName: review.authorName,
    body: review.body,
    rating: review.rating,
    createdAt: new Date().toISOString(),
    visible: review.visible ?? false,
  };
  reviews.push(entry);
  await writePropertyReviews(reviews);
  return entry;
}

export async function replaceAllPropertyReviews(
  reviews: PropertyReviewStored[],
): Promise<void> {
  const normalized = reviews
    .map((r) => normalizeReviewInput(r))
    .filter((r): r is PropertyReviewStored => r != null);
  await writePropertyReviews(normalized);
}
