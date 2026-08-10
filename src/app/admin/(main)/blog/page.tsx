import { readBlogData } from "@/lib/blog/storage";
import { loadAllBlogPostsForAdmin } from "@/lib/blog/load";
import { normalizeSiteLanguage } from "@/lib/i18n";
import { BlogManager } from "../../BlogManager";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ lang?: string | string[] }>;
};

export default async function AdminBlogPage({ searchParams }: Props) {
  const sp = await searchParams;
  const language = normalizeSiteLanguage(sp.lang);
  const data = await readBlogData(language);
  const posts = await loadAllBlogPostsForAdmin(language);
  return (
    <BlogManager
      key={language}
      initial={{ settings: data.settings, posts }}
      language={language}
    />
  );
}
