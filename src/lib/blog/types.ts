export type BlogPostStatus = "draft" | "published";

export type BlogPostStored = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  coverImageSrc: string;
  author: string;
  publishedAt: string;
  status: BlogPostStatus;
  seoDescription: string;
};

export type BlogPost = BlogPostStored;

export type BlogSettings = {
  title: string;
  subtitle: string;
};

export type BlogDataFile = {
  settings: BlogSettings;
  posts: BlogPostStored[];
};

/** Overlay inglés: solo campos de texto que difieren del español. */
export type BlogEnOverlay = {
  settings?: Partial<BlogSettings>;
  posts?: Array<{
    id: string;
    title?: string;
    excerpt?: string;
    body?: string;
    seoDescription?: string;
  }>;
};
