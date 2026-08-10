import type { BlogPostStored, BlogSettings, BlogEnOverlay } from "./types";

function valuesEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export type BlogPostTextOverlay = NonNullable<BlogEnOverlay["posts"]>[number];

export function mergeBlogSettings(
  base: BlogSettings,
  overlay: Partial<BlogSettings> | undefined,
): BlogSettings {
  if (!overlay) return base;
  return {
    title: overlay.title !== undefined ? overlay.title : base.title,
    subtitle: overlay.subtitle !== undefined ? overlay.subtitle : base.subtitle,
  };
}

export function mergeBlogPostWithOverlay(
  base: BlogPostStored,
  overlay: BlogPostTextOverlay | undefined,
): BlogPostStored {
  if (!overlay) return base;
  return {
    ...base,
    ...(overlay.title !== undefined ? { title: overlay.title } : {}),
    ...(overlay.excerpt !== undefined ? { excerpt: overlay.excerpt } : {}),
    ...(overlay.body !== undefined ? { body: overlay.body } : {}),
    ...(overlay.seoDescription !== undefined
      ? { seoDescription: overlay.seoDescription }
      : {}),
  };
}

export function mergeBlogPosts(
  spanish: BlogPostStored[],
  overlayPosts: BlogPostTextOverlay[] | undefined,
): BlogPostStored[] {
  if (!overlayPosts?.length) return spanish;
  const byId = new Map(overlayPosts.map((p) => [p.id, p]));
  return spanish.map((post) => mergeBlogPostWithOverlay(post, byId.get(post.id)));
}

export function buildBlogPostTextOverlay(
  spanish: BlogPostStored,
  draft: BlogPostStored,
): BlogPostTextOverlay | null {
  const partial: BlogPostTextOverlay = { id: draft.id };
  let hasDiff = false;

  if ((draft.title ?? "") !== (spanish.title ?? "")) {
    partial.title = draft.title;
    hasDiff = true;
  }
  if ((draft.excerpt ?? "") !== (spanish.excerpt ?? "")) {
    partial.excerpt = draft.excerpt;
    hasDiff = true;
  }
  if ((draft.body ?? "") !== (spanish.body ?? "")) {
    partial.body = draft.body;
    hasDiff = true;
  }
  if ((draft.seoDescription ?? "") !== (spanish.seoDescription ?? "")) {
    partial.seoDescription = draft.seoDescription;
    hasDiff = true;
  }

  return hasDiff ? partial : null;
}

export function buildBlogEnglishOverlay(
  spanishSettings: BlogSettings,
  draftSettings: BlogSettings,
  spanishPosts: BlogPostStored[],
  draftPosts: BlogPostStored[],
): BlogEnOverlay {
  const overlay: BlogEnOverlay = {};
  const settingsPartial: Partial<BlogSettings> = {};

  if ((draftSettings.title ?? "") !== (spanishSettings.title ?? "")) {
    settingsPartial.title = draftSettings.title;
  }
  if ((draftSettings.subtitle ?? "") !== (spanishSettings.subtitle ?? "")) {
    settingsPartial.subtitle = draftSettings.subtitle;
  }
  if (Object.keys(settingsPartial).length > 0) {
    overlay.settings = settingsPartial;
  }

  const spanishById = new Map(spanishPosts.map((p) => [p.id, p]));
  const posts: BlogPostTextOverlay[] = [];
  for (const draft of draftPosts) {
    const spanish = spanishById.get(draft.id);
    if (!spanish) continue;
    const entry = buildBlogPostTextOverlay(spanish, draft);
    if (entry) posts.push(entry);
  }
  if (posts.length > 0) {
    overlay.posts = posts;
  }

  return overlay;
}

export function overlayHasContent(overlay: BlogEnOverlay): boolean {
  return (
    (overlay.settings != null && Object.keys(overlay.settings).length > 0) ||
    (overlay.posts != null && overlay.posts.length > 0)
  );
}

export function settingsOverlayEmpty(settings: Partial<BlogSettings> | undefined): boolean {
  return settings == null || Object.keys(settings).length === 0;
}

export { valuesEqual as blogOverlayValuesEqual };
