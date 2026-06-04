import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { readPageContent } from "@/lib/pageContent/storage";
import { pickHomeHeader, pickHomeHero } from "@/lib/pageContent/homeTypes";
import { loadBlogSettings, loadPublishedBlogPosts } from "@/lib/blog/load";
import { SiteHeader } from "@/components/home/SiteHeader";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { WhatsAppFab } from "@/components/properties/WhatsAppFab";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await loadBlogSettings();
  return {
    title: `${settings.title} | Top Rentals`,
    description: settings.subtitle || undefined,
  };
}

export default async function BlogIndexPage() {
  const [homeContent, settings, posts] = await Promise.all([
    readPageContent("home"),
    loadBlogSettings(),
    loadPublishedBlogPosts(),
  ]);
  const header = pickHomeHeader(homeContent);
  const hero = pickHomeHero(homeContent);
  const whatsapp =
    hero.whatsappEnabled && hero.whatsappUrl ? hero.whatsappUrl : null;

  return (
    <>
      <SiteHeader header={header} />
      <main className="bg-white">
        <div
          data-reveal
          className="mx-auto w-full max-w-[1440px] px-6 pt-10 pb-16 lg:px-12 lg:pt-14 lg:pb-24"
        >
          <header className="max-w-3xl">
            <h1 className="text-[clamp(2rem,4vw,2.75rem)] font-bold leading-tight tracking-tight text-neutral-950">
              {settings.title}
            </h1>
            {settings.subtitle ? (
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-600 lg:text-lg">
                {settings.subtitle}
              </p>
            ) : null}
          </header>

          {posts.length > 0 ? (
            <div
              data-reveal
              style={{ "--reveal-delay": "120ms" } as CSSProperties}
              className="mt-12 grid gap-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-12"
            >
              {posts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <p className="mt-12 text-neutral-600">
              Próximamente publicaremos nuevas entradas.
            </p>
          )}
        </div>
      </main>
      {whatsapp ? <WhatsAppFab url={whatsapp} /> : null}
    </>
  );
}
