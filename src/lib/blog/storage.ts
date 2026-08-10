import { dataFilePath } from "@/lib/repoRoot";
import { readJsonFile, writeJsonFile } from "@/lib/fsJson";
import {
  DEFAULT_SITE_LANGUAGE,
  type SiteLanguage,
} from "@/lib/i18n";
import {
  buildBlogEnglishOverlay,
  mergeBlogPosts,
  mergeBlogSettings,
} from "./overlay";
import type { BlogDataFile, BlogEnOverlay, BlogSettings } from "./types";

const DEFAULT_SETTINGS: BlogSettings = {
  title: "Blog",
  subtitle:
    "Novedades, consejos y tendencias sobre alquileres temporarios y hospitalidad.",
};

const DEFAULT: BlogDataFile = {
  settings: DEFAULT_SETTINGS,
  posts: [],
};

const DEFAULT_EN_OVERLAY: BlogEnOverlay = {};

function filePath(): string {
  return dataFilePath("blog-data.json");
}

function enFilePath(): string {
  return dataFilePath("blog-data.en.json");
}

async function readSpanishBlogData(): Promise<BlogDataFile> {
  const data = await readJsonFile<BlogDataFile>(filePath(), DEFAULT);
  return {
    settings: {
      title: String(data.settings?.title ?? DEFAULT_SETTINGS.title),
      subtitle: String(data.settings?.subtitle ?? DEFAULT_SETTINGS.subtitle),
    },
    posts: Array.isArray(data.posts) ? data.posts : [],
  };
}

async function readEnglishOverlay(): Promise<BlogEnOverlay> {
  return readJsonFile<BlogEnOverlay>(enFilePath(), DEFAULT_EN_OVERLAY);
}

export async function readBlogData(
  language: SiteLanguage = DEFAULT_SITE_LANGUAGE,
): Promise<BlogDataFile> {
  const spanish = await readSpanishBlogData();
  if (language === "en") {
    const overlay = await readEnglishOverlay();
    return {
      settings: mergeBlogSettings(spanish.settings, overlay.settings),
      posts: mergeBlogPosts(spanish.posts, overlay.posts),
    };
  }
  return spanish;
}

/** Lee datos españoles sin overlay (para diff al guardar EN). */
export async function readBlogDataSpanish(): Promise<BlogDataFile> {
  return readSpanishBlogData();
}

export async function writeBlogData(data: BlogDataFile): Promise<void> {
  await writeJsonFile(filePath(), data);
}

/**
 * Persiste solo el overlay inglés (campos de texto distintos del español).
 * No modifica `blog-data.json`.
 */
export async function writeBlogEnglishOverlay(
  draftSettings: BlogSettings,
  draftPosts: BlogDataFile["posts"],
): Promise<void> {
  const spanish = await readSpanishBlogData();
  const overlay = buildBlogEnglishOverlay(
    spanish.settings,
    draftSettings,
    spanish.posts,
    draftPosts,
  );
  await writeJsonFile(enFilePath(), overlay);
}
