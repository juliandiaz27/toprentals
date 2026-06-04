import {
  normalizeStoredRichHtml,
  sanitizeBlogHtml,
} from "@/lib/richText/sanitize";
import { readBlogData } from "./storage";
import type { BlogPost, BlogPostStored, BlogSettings } from "./types";

export function normalizeBlogPost(raw: Partial<BlogPostStored>): BlogPostStored | null {
  const id = String(raw.id ?? "").trim();
  const title = String(raw.title ?? "").trim();
  const slug = String(raw.slug ?? "").trim();
  if (!id || !title || !slug) return null;

  const status = raw.status === "draft" ? "draft" : "published";
  const publishedAt = String(raw.publishedAt ?? "").trim() || new Date().toISOString();

  return {
    id,
    slug,
    title,
    excerpt: String(raw.excerpt ?? "").trim(),
    body: sanitizeBlogHtml(
      normalizeStoredRichHtml(String(raw.body ?? "")),
    ),
    coverImageSrc: String(raw.coverImageSrc ?? "").trim(),
    author: String(raw.author ?? "Top Rentals").trim() || "Top Rentals",
    publishedAt,
    status,
    seoDescription: String(raw.seoDescription ?? "").trim(),
  };
}

export async function loadBlogSettings(): Promise<BlogSettings> {
  const data = await readBlogData();
  return data.settings;
}

export async function loadPublishedBlogPosts(): Promise<BlogPost[]> {
  const data = await readBlogData();
  return data.posts
    .map((p) => normalizeBlogPost(p))
    .filter((p): p is BlogPost => p != null && p.status === "published")
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
}

export async function getBlogPostBySlug(
  slug: string,
  options?: { includeDrafts?: boolean },
): Promise<BlogPost | null> {
  const data = await readBlogData();
  const found = data.posts.find((p) => p.slug === slug);
  if (!found) return null;
  const post = normalizeBlogPost(found);
  if (!post) return null;
  if (!options?.includeDrafts && post.status !== "published") return null;
  return post;
}

export async function loadAllBlogPostsForAdmin(): Promise<BlogPost[]> {
  const data = await readBlogData();
  return data.posts
    .map((p) => normalizeBlogPost(p))
    .filter((p): p is BlogPost => p != null)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
}
