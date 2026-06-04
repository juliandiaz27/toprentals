import { dataFilePath } from "@/lib/repoRoot";
import { readJsonFile, writeJsonFile } from "@/lib/fsJson";
import type { BlogDataFile, BlogSettings } from "./types";

const DEFAULT_SETTINGS: BlogSettings = {
  title: "Blog",
  subtitle:
    "Novedades, consejos y tendencias sobre alquileres temporarios y hospitalidad.",
};

const DEFAULT: BlogDataFile = {
  settings: DEFAULT_SETTINGS,
  posts: [],
};

const filePath = () => dataFilePath("blog-data.json");

export async function readBlogData(): Promise<BlogDataFile> {
  const data = await readJsonFile<BlogDataFile>(filePath(), DEFAULT);
  return {
    settings: {
      title: String(data.settings?.title ?? DEFAULT_SETTINGS.title),
      subtitle: String(data.settings?.subtitle ?? DEFAULT_SETTINGS.subtitle),
    },
    posts: Array.isArray(data.posts) ? data.posts : [],
  };
}

export async function writeBlogData(data: BlogDataFile): Promise<void> {
  await writeJsonFile(filePath(), data);
}
