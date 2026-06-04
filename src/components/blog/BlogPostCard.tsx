import Image from "next/image";
import Link from "next/link";
import { formatBlogDate } from "@/lib/blog/format";
import type { BlogPost } from "@/lib/blog/types";

type Props = {
  post: BlogPost;
};

export function BlogPostCard({ post }: Props) {
  const cover =
    post.coverImageSrc || "/images/placeholders/page-hero.svg";
  const dateLabel = formatBlogDate(post.publishedAt);

  return (
    <article className="group flex flex-col">
      <Link
        href={`/blog/${post.slug}`}
        className="relative mb-5 block aspect-[16/10] overflow-hidden rounded-xl bg-neutral-100"
      >
        <Image
          src={cover}
          alt=""
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </Link>
      {dateLabel ? (
        <time
          dateTime={post.publishedAt}
          className="text-[13px] font-medium uppercase tracking-wide text-neutral-500"
        >
          {dateLabel}
        </time>
      ) : null}
      <h2 className="mt-2 text-xl font-bold leading-snug text-neutral-950">
        <Link
          href={`/blog/${post.slug}`}
          className="transition hover:text-[#f27438]"
        >
          {post.title}
        </Link>
      </h2>
      {post.excerpt ? (
        <p className="mt-3 flex-1 text-[15px] leading-relaxed text-neutral-600">
          {post.excerpt}
        </p>
      ) : null}
      <Link
        href={`/blog/${post.slug}`}
        className="mt-4 inline-flex text-[14px] font-semibold text-[#f27438] transition hover:underline"
      >
        Leer más →
      </Link>
    </article>
  );
}
