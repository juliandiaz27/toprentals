import { readBlogData } from "@/lib/blog/storage";
import { loadAllBlogPostsForAdmin } from "@/lib/blog/load";
import { BlogManager } from "../../BlogManager";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const data = await readBlogData();
  const posts = await loadAllBlogPostsForAdmin();
  return <BlogManager initial={{ settings: data.settings, posts }} />;
}
