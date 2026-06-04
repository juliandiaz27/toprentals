export type PropertyReviewStored = {
  id: string;
  propertySlug: string;
  authorName: string;
  body: string;
  /** 1–5, opcional */
  rating?: number;
  createdAt: string;
  /** Si true, se muestra en la ficha pública */
  visible: boolean;
};

export type PropertyReviewsFile = {
  reviews: PropertyReviewStored[];
};

export type PropertyReview = PropertyReviewStored;
