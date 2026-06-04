import { dataFilePath } from "@/lib/repoRoot";
import { readJsonFile, writeJsonFile } from "@/lib/fsJson";
import type { PropertyReviewsFile, PropertyReviewStored } from "./reviewsTypes";

const DEFAULT: PropertyReviewsFile = { reviews: [] };

const filePath = () => dataFilePath("property-reviews.json");

export async function readPropertyReviews(): Promise<PropertyReviewStored[]> {
  const data = await readJsonFile<PropertyReviewsFile>(filePath(), DEFAULT);
  return Array.isArray(data.reviews) ? data.reviews : [];
}

export async function writePropertyReviews(
  reviews: PropertyReviewStored[],
): Promise<void> {
  await writeJsonFile(filePath(), { reviews });
}
