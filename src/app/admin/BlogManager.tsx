"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { slugifyBlogTitle } from "@/lib/blog/slugify";
import type { BlogDataFile, BlogPostStatus, BlogPostStored } from "@/lib/blog/types";
import { MEDIA_UPLOAD_GUIDES } from "@/lib/mediaUploadGuide";
import { saveBlogData } from "./blogActions";
import { MediaUploadGuide } from "./MediaUploadGuide";
import { WysiwygField } from "./WysiwygField";

type Props = {
  initial: BlogDataFile;
};

type View =
  | { mode: "list" }
  | { mode: "edit"; index: number }
  | { mode: "new" };

function newPostId(): string {
  return `post-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function emptyPost(): BlogPostStored {
  const now = new Date().toISOString();
  return {
    id: newPostId(),
    slug: "",
    title: "",
    excerpt: "",
    body: "",
    coverImageSrc: "",
    author: "Top Rentals",
    publishedAt: now,
    status: "draft",
    seoDescription: "",
  };
}

function postStatus(post: BlogPostStored): {
  label: string;
  className: string;
} {
  if (post.status === "published") {
    return { label: "Publicada", className: "admin-list-card__badge--live" };
  }
  return { label: "Borrador", className: "admin-list-card__badge--hidden" };
}

function formatPostDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("es-AR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function IconEye({ off }: { off?: boolean }) {
  if (off) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M3 3l18 18M10.5 10.7a2.5 2.5 0 003.6 3.6M7.2 7.4C5.6 8.5 4.2 10 3 12c2.5 4.5 6.5 7.5 9 7.5 1.1 0 2.2-.4 3.2-1.1M9.9 5.1C10.6 5 11.3 5 12 5c2.5 0 6.5 3 9 7.5-.7 1.2-1.6 2.3-2.6 3.2"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

function toDatetimeLocal(iso: string): string {
  try {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return "";
  }
}

function fromDatetimeLocal(value: string): string {
  if (!value) return new Date().toISOString();
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

export function BlogManager({ initial }: Props) {
  const router = useRouter();
  const [view, setView] = useState<View>({ mode: "list" });
  const [settings, setSettings] = useState(initial.settings);
  const [posts, setPosts] = useState(initial.posts);
  const [draft, setDraft] = useState<BlogPostStored>(emptyPost());
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const persist = useCallback(
    (
      nextSettings: typeof settings,
      nextPosts: BlogPostStored[],
      uploads?: { cover?: { file: File; postId: string } },
      onDone?: () => void,
    ) => {
      setError(null);
      setSuccess(null);
      const fd = new FormData();
      fd.set("blog.settings.title", nextSettings.title);
      fd.set("blog.settings.subtitle", nextSettings.subtitle);
      fd.set("blog.posts", JSON.stringify(nextPosts));
      if (uploads?.cover) {
        fd.set("__coverFile", uploads.cover.file);
        fd.set("__coverPostId", uploads.cover.postId);
      }

      startTransition(async () => {
        const res = await saveBlogData(fd);
        if (!res.ok) {
          setError(res.error ?? "Error al guardar");
          return;
        }
        if (res.settings) setSettings(res.settings);
        if (res.posts) setPosts(res.posts);
        setSuccess("Cambios guardados.");
        setCoverFile(null);
        router.refresh();
        onDone?.();
      });
    },
    [router],
  );

  function saveSettingsOnly() {
    persist(settings, posts);
  }

  function openNew() {
    setDraft(emptyPost());
    setCoverFile(null);
    setError(null);
    setSuccess(null);
    setView({ mode: "new" });
  }

  function openEdit(index: number) {
    setDraft({ ...posts[index]! });
    setCoverFile(null);
    setError(null);
    setSuccess(null);
    setView({ mode: "edit", index });
  }

  function backToList() {
    setView({ mode: "list" });
    setCoverFile(null);
  }

  function removePost(index: number) {
    const post = posts[index];
    if (!post) return;
    if (!window.confirm(`¿Eliminar «${post.title}»?`)) return;
    const next = posts.filter((_, i) => i !== index);
    persist(settings, next);
  }

  function togglePublish(index: number) {
    const next = posts.map((post, i) => {
      if (i !== index) return post;
      const status: BlogPostStatus =
        post.status === "published" ? "draft" : "published";
      return { ...post, status };
    });
    persist(settings, next);
  }

  function commitDraft() {
    const title = draft.title.trim();
    if (!title) {
      setError("El título es obligatorio.");
      return;
    }
    let slug = draft.slug.trim();
    if (!slug) slug = slugifyBlogTitle(title);
    if (!slug) {
      setError("No se pudo generar el slug.");
      return;
    }

    const entry: BlogPostStored = {
      ...draft,
      title,
      slug,
      excerpt: draft.excerpt.trim(),
      author: draft.author.trim() || "Top Rentals",
      seoDescription: draft.seoDescription.trim(),
    };

    const duplicate = posts.some(
      (p, i) =>
        p.slug === entry.slug &&
        (view.mode !== "edit" || i !== view.index),
    );
    if (duplicate) {
      setError(`Ya existe una entrada con el slug «${entry.slug}».`);
      return;
    }

    let next: BlogPostStored[];
    if (view.mode === "edit") {
      next = posts.map((p, i) => (i === view.index ? entry : p));
    } else {
      next = [entry, ...posts];
    }

    const uploads =
      coverFile && coverFile.size > 0
        ? { cover: { file: coverFile, postId: entry.id } }
        : undefined;

    persist(settings, next, uploads, () => {
      setView({ mode: "list" });
    });
  }

  if (view.mode !== "list") {
    const coverPreview =
      coverFile != null
        ? URL.createObjectURL(coverFile)
        : draft.coverImageSrc || "/images/placeholders/page-hero.svg";

    return (
      <div className="page-editor w-full">
        <button
          type="button"
          className="admin-editor-back"
          onClick={backToList}
        >
          ← Volver al listado
        </button>

        <header className="admin-page-header">
          <div>
            <h1>{view.mode === "new" ? "Nueva entrada" : "Editar entrada"}</h1>
            <p>
              {view.mode === "new"
                ? "Completá los datos y guardá para publicar en el blog."
                : `Editando: ${draft.title || "—"}`}
            </p>
          </div>
          <button
            type="button"
            className="admin-btn-primary shrink-0"
            disabled={pending}
            onClick={commitDraft}
          >
            {pending ? "Guardando…" : "Guardar"}
          </button>
        </header>

        {error ? (
          <p className="admin-alert-error mb-6" role="alert">
            {error}
          </p>
        ) : null}

        <div className="grid max-w-3xl gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className="admin-field-label">Título *</span>
            <input
              className="admin-input"
              value={draft.title}
              onChange={(e) => {
                const title = e.target.value;
                setDraft((d) => ({
                  ...d,
                  title,
                  slug:
                    d.slug === "" || d.slug === slugifyBlogTitle(d.title)
                      ? slugifyBlogTitle(title)
                      : d.slug,
                }));
              }}
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="admin-field-label">Slug (URL)</span>
            <input
              className="admin-input font-mono text-sm"
              value={draft.slug}
              onChange={(e) =>
                setDraft((d) => ({ ...d, slug: e.target.value }))
              }
            />
            <span className="admin-field-hint">/blog/{draft.slug || "…"}</span>
          </label>

          <label className="flex flex-col gap-1">
            <span className="admin-field-label">Estado</span>
            <select
              className="admin-input"
              value={draft.status}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  status: e.target.value === "published" ? "published" : "draft",
                }))
              }
            >
              <option value="draft">Borrador</option>
              <option value="published">Publicada</option>
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="admin-field-label">Fecha de publicación</span>
            <input
              type="datetime-local"
              className="admin-input"
              value={toDatetimeLocal(draft.publishedAt)}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  publishedAt: fromDatetimeLocal(e.target.value),
                }))
              }
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="admin-field-label">Autor</span>
            <input
              className="admin-input"
              value={draft.author}
              onChange={(e) =>
                setDraft((d) => ({ ...d, author: e.target.value }))
              }
            />
          </label>

          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="admin-field-label">Extracto</span>
            <textarea
              className="admin-input min-h-[4rem]"
              rows={3}
              value={draft.excerpt}
              onChange={(e) =>
                setDraft((d) => ({ ...d, excerpt: e.target.value }))
              }
            />
          </label>

          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="admin-field-label">Descripción SEO</span>
            <input
              className="admin-input"
              value={draft.seoDescription}
              onChange={(e) =>
                setDraft((d) => ({ ...d, seoDescription: e.target.value }))
              }
            />
          </label>

          <div className="sm:col-span-2">
            <span className="admin-field-label">Imagen de portada</span>
            <MediaUploadGuide
              guide={MEDIA_UPLOAD_GUIDES.blogCover}
              className="mt-1 max-w-md"
            />
            <div className="mt-2 flex flex-wrap items-start gap-4">
              <div className="relative h-28 w-44 overflow-hidden rounded-lg border border-[var(--admin-border)]">
                <Image
                  src={coverPreview}
                  alt=""
                  fill
                  className="object-cover"
                  unoptimized={coverPreview.startsWith("blob:")}
                />
              </div>
              <input
                type="file"
                accept="image/*"
                className="admin-input max-w-xs"
                onChange={(e) =>
                  setCoverFile(e.target.files?.[0] ?? null)
                }
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <WysiwygField
              key={draft.id}
              name="blog.post.body"
              label="Contenido"
              variant="blog"
              defaultValue={draft.body}
              onHtmlChange={(html) =>
                setDraft((d) => ({ ...d, body: html }))
              }
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-editor w-full">
      <header className="admin-page-header flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1>Blog</h1>
          <p>
            Gestioná las entradas y el texto de{" "}
            <a href="/blog" target="_blank" rel="noopener noreferrer">
              /blog
            </a>
            .
          </p>
        </div>
        <button
          type="button"
          className="admin-btn-primary shrink-0"
          disabled={pending}
          onClick={openNew}
        >
          + Nueva entrada
        </button>
      </header>

      {error ? (
        <p className="admin-alert-error mb-6" role="alert">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="admin-alert-success mb-6" role="status">
          {success}
        </p>
      ) : null}

      <section className="mb-6">
        <h2 className="admin-form-section-label">Página /blog</h2>
        <div className="admin-list-card items-start gap-4">
          <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="admin-field-label">Título</span>
              <input
                className="admin-input"
                value={settings.title}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, title: e.target.value }))
                }
              />
            </label>
            <label className="flex flex-col gap-1 sm:col-span-2">
              <span className="admin-field-label">Subtítulo</span>
              <input
                className="admin-input"
                value={settings.subtitle}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, subtitle: e.target.value }))
                }
              />
            </label>
          </div>
          <button
            type="button"
            className="admin-btn-secondary shrink-0 text-sm"
            disabled={pending}
            onClick={saveSettingsOnly}
          >
            Guardar
          </button>
        </div>
      </section>

      {posts.length === 0 ? (
        <p className="text-sm text-[var(--admin-text-muted)]">
          Todavía no hay entradas. Creá la primera con «Nueva entrada».
        </p>
      ) : (
        <ul className="admin-list">
          {posts.map((post, index) => {
            const status = postStatus(post);
            const isDraft = post.status !== "published";
            const meta = [post.author, formatPostDate(post.publishedAt)]
              .filter(Boolean)
              .join(" · ");

            return (
              <li key={post.id} className="admin-list-card">
                <div className="admin-list-card__main">
                  <span className="admin-list-card__icon" aria-hidden>
                    📝
                  </span>
                  <div className="min-w-0">
                    <p className="admin-list-card__title">{post.title}</p>
                    <div className="admin-list-card__meta-row">
                      <span
                        className={`admin-list-card__badge ${status.className}`}
                      >
                        {status.label}
                      </span>
                      <span className="font-mono text-[0.6875rem] text-[var(--admin-text-dim)]">
                        /blog/{post.slug}
                      </span>
                    </div>
                    {meta ? <p className="admin-list-card__meta">{meta}</p> : null}
                  </div>
                </div>
                <div className="admin-list-card__actions">
                  <button
                    type="button"
                    className={`admin-visibility-btn ${isDraft ? "admin-visibility-btn--off" : ""}`}
                    disabled={pending}
                    onClick={() => togglePublish(index)}
                    aria-label={
                      isDraft ? "Publicar en el sitio" : "Pasar a borrador"
                    }
                    title={isDraft ? "Publicar" : "Borrador"}
                  >
                    <IconEye off={isDraft} />
                  </button>
                  <button
                    type="button"
                    className="admin-btn-secondary text-sm"
                    onClick={() => openEdit(index)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="admin-btn-danger"
                    disabled={pending}
                    onClick={() => removePost(index)}
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
