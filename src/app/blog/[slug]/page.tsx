import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { readPageContent } from "@/lib/pageContent/storage";
import { pickHomeHeader, pickHomeHero } from "@/lib/pageContent/homeTypes";
import {
  getBlogPostBySlug,
  loadPublishedBlogPosts,
} from "@/lib/blog/load";
import { formatBlogDate } from "@/lib/blog/format";
import { SiteHeader } from "@/components/home/SiteHeader";
import { BlogBody } from "@/components/blog/BlogBody";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { WhatsAppFab } from "@/components/properties/WhatsAppFab";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Entrada no encontrada | Top Rentals" };
  return {
    title: `${post.title} | Top Rentals`,
    description: post.seoDescription || post.excerpt || undefined,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const [homeContent, allPosts] = await Promise.all([
    readPageContent("home"),
    loadPublishedBlogPosts(),
  ]);
  const header = pickHomeHeader(homeContent);
  const hero = pickHomeHero(homeContent);
  const whatsapp =
    hero.whatsappEnabled && hero.whatsappUrl ? hero.whatsappUrl : null;
  const related = allPosts.filter((p) => p.slug !== slug).slice(0, 3);
  const cover =
    post.coverImageSrc || "/images/placeholders/page-hero.svg";
  const dateLabel = formatBlogDate(post.publishedAt);

  return (
    <>
      <SiteHeader header={header} />
      <main className="bg-white">
        <article className="mx-auto w-full max-w-[1440px] px-6 pt-10 pb-16 lg:px-12 lg:pt-14 lg:pb-24">
          <nav
            data-reveal
            className="mb-8 text-[14px] text-neutral-500"
            aria-label="Miga de pan"
          >
            <Link href="/blog" className="transition hover:text-neutral-950">
              Blog
            </Link>
            <span className="mx-2" aria-hidden>
              /
            </span>
            <span className="text-neutral-800">{post.title}</span>
          </nav>

          <header data-reveal className="max-w-3xl">
            {dateLabel ? (
              <time
                dateTime={post.publishedAt}
                className="text-[13px] font-medium uppercase tracking-wide text-neutral-500"
              >
                {dateLabel}
              </time>
            ) : null}
            <h1 className="mt-3 text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-tight tracking-tight text-neutral-950">
              {post.title}
            </h1>
            {post.author ? (
              <p className="mt-3 text-[15px] text-neutral-600">
                Por {post.author}
              </p>
            ) : null}
            {post.excerpt ? (
              <p className="mt-4 text-lg leading-relaxed text-neutral-600">
                {post.excerpt}
              </p>
            ) : null}
          </header>

          <div
            data-reveal
            style={{ "--reveal-delay": "80ms" } as CSSProperties}
            className="relative mt-10 aspect-[21/9] max-w-4xl overflow-hidden rounded-2xl bg-neutral-100"
          >
            <Image
              src={cover}
              alt=""
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 896px"
            />
          </div>

          <div
            data-reveal
            style={{ "--reveal-delay": "160ms" } as CSSProperties}
            className="prose-blog mx-auto mt-12 max-w-3xl"
          >
            <BlogBody html={post.body} />
          </div>
        </article>

        {related.length > 0 ? (
          <section className="border-t border-neutral-200 bg-[#F8F8F8] px-6 py-14 lg:px-12 lg:py-20">
            <div className="mx-auto max-w-[1440px]">
              <h2 className="text-2xl font-bold text-neutral-950">
                Más en el blog
              </h2>
              <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
                {related.map((item) => (
                  <BlogPostCard key={item.id} post={item} />
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </main>
      {whatsapp ? <WhatsAppFab url={whatsapp} /> : null}
    </>
  );
}
