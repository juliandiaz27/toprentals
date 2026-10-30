import type { MetadataRoute } from "next";
import { loadPropertyListings } from "@/lib/properties/catalog";
import { loadPublishedBlogPosts } from "@/lib/blog/load";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

/** Páginas públicas indexables (el motor de reservas y el área de clientes quedan afuera). */
const STATIC_PAGES: { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/propiedades", priority: 0.9, changeFrequency: "weekly" },
  { path: "/corporate", priority: 0.8, changeFrequency: "monthly" },
  { path: "/club-top-rentals", priority: 0.6, changeFrequency: "monthly" },
  { path: "/propietarios", priority: 0.6, changeFrequency: "monthly" },
  { path: "/real-estate", priority: 0.5, changeFrequency: "monthly" },
  { path: "/nosotros", priority: 0.5, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.6, changeFrequency: "weekly" },
  { path: "/contacto", priority: 0.5, changeFrequency: "monthly" },
  { path: "/trabaja-con-nosotros", priority: 0.3, changeFrequency: "monthly" },
];

/** Se genera solo con el catálogo y el blog: cada edificio o nota nueva entra sin tocar código. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [listings, posts] = await Promise.all([
    loadPropertyListings({ language: "es" }),
    loadPublishedBlogPosts("es"),
  ]);

  return [
    ...STATIC_PAGES.map((page) => ({
      url: absoluteUrl(page.path),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...listings
      .filter((l) => !l.comingSoon)
      .map((l) => ({
        url: absoluteUrl(`/propiedades/${l.slug}`),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
    ...posts.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: post.publishedAt ? new Date(post.publishedAt) : undefined,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
