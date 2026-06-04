import { loadPropertiesCatalogEditorState } from "@/lib/properties/catalogEditor";
import { readPropertyReviews } from "@/lib/properties/reviewsStorage";
import { PropertyReviewsManager } from "@/app/admin/PropertyReviewsManager";

export const dynamic = "force-dynamic";

export default async function AdminPropertyReviewsPage() {
  const [catalog, reviews] = await Promise.all([
    loadPropertiesCatalogEditorState(),
    readPropertyReviews(),
  ]);

  return (
    <PropertyReviewsManager
      initialReviews={reviews}
      properties={catalog.listings}
    />
  );
}
