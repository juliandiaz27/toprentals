"use server";

import { revalidatePath } from "next/cache";
import { isAuthed } from "@/lib/auth";
import {
  MEDIA_UPLOAD_GUIDES,
  validateFileAgainstGuide,
} from "@/lib/mediaUploadGuide";
import { saveUpload } from "@/lib/upload";
import { normalizeBlogPost } from "@/lib/blog/load";
import {
  readBlogData,
  writeBlogData,
  writeBlogEnglishOverlay,
} from "@/lib/blog/storage";
import { normalizeSiteLanguage } from "@/lib/i18n";
import type { BlogDataFile, BlogPostStored, BlogSettings } from "@/lib/blog/types";
import type { ActionResult } from "./actions";

export type BlogSaveResult = ActionResult & {
  settings?: BlogSettings;
  posts?: BlogPostStored[];
};

function parsePostsPayload(raw: string): BlogPostStored[] | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;
    const out: BlogPostStored[] = [];
    for (const entry of parsed) {
      if (!entry || typeof entry !== "object") continue;
      const normalized = normalizeBlogPost(entry as BlogPostStored);
      if (normalized) out.push(normalized);
    }
    return out;
  } catch {
    return null;
  }
}

export async function saveBlogData(formData: FormData): Promise<BlogSaveResult> {
  try {
    if (!(await isAuthed())) {
      return { ok: false, error: "No autorizado" };
    }

    const language = normalizeSiteLanguage(formData.get("language"));

    const settings: BlogSettings = {
      title: String(formData.get("blog.settings.title") ?? "Blog").trim() || "Blog",
      subtitle: String(formData.get("blog.settings.subtitle") ?? "").trim(),
    };

    const posts = parsePostsPayload(String(formData.get("blog.posts") ?? ""));
    if (posts === null) {
      return { ok: false, error: "Datos de entradas inválidos." };
    }

    if (language === "en") {
      await writeBlogEnglishOverlay(settings, posts);
      const merged = await readBlogData("en");
      revalidatePath("/blog");
      for (const post of merged.posts) {
        revalidatePath(`/blog/${post.slug}`);
      }
      return { ok: true, settings: merged.settings, posts: merged.posts };
    }

    const slugs = new Set<string>();
    const ids = new Set<string>();
    for (const post of posts) {
      if (ids.has(post.id)) {
        return { ok: false, error: `ID duplicado: ${post.id}` };
      }
      ids.add(post.id);
      if (slugs.has(post.slug)) {
        return { ok: false, error: `Slug duplicado: ${post.slug}` };
      }
      slugs.add(post.slug);
    }

    const data: BlogDataFile = { settings, posts };

    const coverFile = formData.get("__coverFile");
    const coverPostId = String(formData.get("__coverPostId") ?? "").trim();
    if (coverFile instanceof File && coverFile.size > 0 && coverPostId) {
      const guide = MEDIA_UPLOAD_GUIDES.blogCover;
      const sizeError = validateFileAgainstGuide(coverFile, guide);
      if (sizeError) {
        return { ok: false, error: `Portada: ${sizeError}` };
      }
      const url = await saveUpload(coverFile, `blog-cover-${coverPostId}`, {
        maxSizeMb: guide.maxSizeMb,
      });
      const idx = data.posts.findIndex((p) => p.id === coverPostId);
      if (idx >= 0) {
        data.posts[idx] = { ...data.posts[idx]!, coverImageSrc: url };
      }
    }

    await writeBlogData(data);

    revalidatePath("/blog");
    for (const post of data.posts) {
      revalidatePath(`/blog/${post.slug}`);
    }

    return { ok: true, settings: data.settings, posts: data.posts };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Error al guardar el blog",
    };
  }
}
