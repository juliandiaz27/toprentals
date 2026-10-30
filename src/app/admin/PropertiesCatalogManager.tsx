"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition, useRef } from "react";
import { textFromLines, linesFromText } from "@/lib/properties/catalogText";
import type { PropertiesCatalogEditorState } from "@/lib/properties/catalogEditor";
import {
  PROPERTY_AUDIENCES,
  type PropertyAudience,
  type PropertyListingStored,
} from "@/lib/properties/catalogTypes";
import { slugifyPropertyName } from "@/lib/properties/slugify";
import {
  detailForAdminForm,
  emptyUnit,
  normalizeDetailForForm,
} from "@/lib/properties/detailForm";
import { MEDIA_UPLOAD_GUIDES } from "@/lib/mediaUploadGuide";
import { MediaUploadGuide } from "./MediaUploadGuide";
import { AdminLanguageSwitcher } from "./AdminLanguageSwitcher";
import { EditorToc, SaveState, sectionAnchorId, useUnsavedChanges } from "./EditorChrome";
import { normalizeAmenities } from "@/lib/properties/amenities";
import { propertyCompleteness } from "@/lib/properties/completeness";

const AUDIENCE_ADMIN_LABELS: Record<PropertyAudience, string> = {
  grupos: "Grupos",
  solo: "Solo",
  familia: "Familia",
};
import { savePropertiesCatalog } from "./propertiesCatalogActions";
import {
  DEFAULT_SITE_LANGUAGE,
  type SiteLanguage,
} from "@/lib/i18n";
import {
  formatElfsightEmbedSnippet,
  parseElfsightAppId,
} from "@/lib/elfsight";

type Props = {
  initial: PropertiesCatalogEditorState;
  language?: SiteLanguage;
  /** Abre directamente la ficha de este slug (desde el inicio del panel). */
  initialEditSlug?: string;
};

/** Borrador del formulario a partir de una propiedad guardada. */
function draftFromListing(
  item: PropertyListingStored,
  all: PropertyListingStored[],
  language: SiteLanguage,
): PropertyListingStored {
  return {
    ...item,
    detail: normalizeDetailForForm(detailForAdminForm(item, all, language), language),
  };
}

const PROPERTY_EDITOR_TOC = [
  "Imagen de listado",
  "Galería (ficha del edificio)",
  "Información general",
  "Reseñas Google (Elfsight)",
  "Descripción",
  "Etiquetas",
  "Puntos de interés cercanos",
  "Franja corporativa y estadísticas",
  "Unidades",
  "Diseño de la ficha",
  "SEO (Google)",
  "Otras propiedades sugeridas",
  "Opciones",
].map((label) => ({ id: sectionAnchorId(label), label }));

type ListFilter = "all" | "live" | "hidden" | "featured" | "incomplete";

const LIST_FILTERS: { id: ListFilter; label: string }[] = [
  { id: "all", label: "Todas" },
  { id: "live", label: "Publicadas" },
  { id: "hidden", label: "Ocultas" },
  { id: "featured", label: "Destacadas" },
  { id: "incomplete", label: "Fichas incompletas" },
];

type View =
  | { mode: "list" }
  | { mode: "edit"; index: number }
  | { mode: "new" };

function emptyListing(defaultCity: string): PropertyListingStored {
  return {
    slug: "",
    gnahsId: 1,
    name: "",
    city: defaultCity,
    neighborhood: "",
    address: "",
    imageSrc: "",
    comingSoon: false,
    hidden: false,
    hasOffer: false,
    isPopular: false,
    audience: [],
    isExclusive: false,
    detail: normalizeDetailForForm(),
  };
}

function propertyStatus(item: PropertyListingStored): {
  label: string;
  className: string;
} {
  if (item.hidden) {
    return { label: "Oculta", className: "admin-list-card__badge--hidden" };
  }
  if (item.comingSoon) {
    return { label: "Próximamente", className: "admin-list-card__badge--soon" };
  }
  return { label: "Publicada", className: "admin-list-card__badge--live" };
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

export function PropertiesCatalogManager({
  initial,
  language = DEFAULT_SITE_LANGUAGE,
  initialEditSlug,
}: Props) {
  const defaultCity = initial.cityOptions[0] ?? "Buenos Aires";
  const router = useRouter();
  const initialEditIndex = initialEditSlug
    ? initial.listings.findIndex((item) => item.slug === initialEditSlug)
    : -1;
  const [view, setView] = useState<View>(
    initialEditIndex >= 0 ? { mode: "edit", index: initialEditIndex } : { mode: "list" },
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [listings, setListings] = useState(initial.listings);
  const [query, setQuery] = useState("");
  const editorFormRef = useRef<HTMLFormElement>(null);
  const { dirty, markSaved } = useUnsavedChanges(editorFormRef);
  const [statusFilter, setStatusFilter] = useState<ListFilter>("all");
  const [featuredSlugs, setFeaturedSlugs] = useState(initial.featuredSlugs);
  const [draft, setDraft] = useState<PropertyListingStored>(() =>
    initialEditIndex >= 0
      ? draftFromListing(initial.listings[initialEditIndex]!, initial.listings, language)
      : emptyListing(defaultCity),
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  /** Fotos nuevas por unidad, por nombre de unidad; se suben al guardar. */
  const [unitImageFiles, setUnitImageFiles] = useState<Record<string, File>>({});
  const [elfsightEmbedInput, setElfsightEmbedInput] = useState(() => {
    const appId =
      initialEditIndex >= 0 ? initial.listings[initialEditIndex]?.elfsightReviewsAppId : "";
    return appId ? formatElfsightEmbedSnippet(appId) : "";
  });

  const persist = useCallback(
    (
      nextListings: PropertyListingStored[],
      nextFeatured: string[],
      uploads?: {
        image?: { file: File; slug: string };
        gallery?: { files: File[]; slug: string };
        units?: { files: Record<string, File>; slug: string };
      },
      onDone?: () => void,
    ) => {
      setError(null);
      setSuccess(null);
      const fd = new FormData();
      fd.set("language", language);
      fd.set("catalog.listings", JSON.stringify(nextListings));
      fd.set("catalog.featuredSlugs", JSON.stringify(nextFeatured));
      if (uploads?.image) {
        fd.set("__imageFile", uploads.image.file);
        fd.set("__imageSlug", uploads.image.slug);
      }
      if (uploads?.gallery?.files.length) {
        fd.set("__gallerySlug", uploads.gallery.slug);
        for (const file of uploads.gallery.files) {
          fd.append("__galleryFile", file);
        }
      }
      if (uploads?.units) {
        fd.set("__unitImageSlug", uploads.units.slug);
        for (const [unitName, file] of Object.entries(uploads.units.files)) {
          fd.append("__unitImageFile", file);
          fd.append("__unitImageName", unitName);
        }
      }

      startTransition(async () => {
        const res = await savePropertiesCatalog(fd);
        if (!res.ok) {
          setError(res.error ?? "Error al guardar");
          return;
        }
        setListings(res.listings ?? nextListings);
        setFeaturedSlugs(res.featuredSlugs ?? nextFeatured);
        setSuccess("Cambios guardados.");
        setImageFile(null);
        setGalleryFiles([]);
        setUnitImageFiles({});
        markSaved();
        router.refresh();
        onDone?.();
      });
    },
    [router, language, markSaved],
  );

  function openNew() {
    setDraft({
      ...emptyListing(defaultCity),
      detail: normalizeDetailForForm(undefined, language),
    });
    setImageFile(null);
    setGalleryFiles([]);
    setUnitImageFiles({});
    setElfsightEmbedInput("");
    setError(null);
    setSuccess(null);
    markSaved();
    setView({ mode: "new" });
  }

  function openEdit(index: number) {
    const item = listings[index]!;
    setDraft(draftFromListing(item, listings, language));
    setImageFile(null);
    setGalleryFiles([]);
    setUnitImageFiles({});
    setElfsightEmbedInput(
      item.elfsightReviewsAppId
        ? formatElfsightEmbedSnippet(item.elfsightReviewsAppId)
        : "",
    );
    setError(null);
    setSuccess(null);
    markSaved();
    setView({ mode: "edit", index });
  }

  function toggleVisibility(index: number) {
    const next = listings.map((item, i) =>
      i === index ? { ...item, hidden: !item.hidden } : item,
    );
    persist(next, featuredSlugs);
  }

  function removeAt(index: number) {
    const item = listings[index];
    if (!item) return;
    if (!window.confirm(`¿Eliminar «${item.name}»?`)) return;
    const next = listings.filter((_, i) => i !== index);
    const nextFeatured = featuredSlugs.filter((s) => s !== item.slug);
    persist(next, nextFeatured);
  }

  function updateDraft(patch: Partial<PropertyListingStored>) {
    setDraft((prev) => {
      const next = { ...prev, ...patch };
      if (patch.name != null && view.mode === "new") {
        next.slug = slugifyPropertyName(patch.name);
      }
      return next;
    });
  }

  function updateDetail(
    patch: Partial<NonNullable<PropertyListingStored["detail"]>>,
  ) {
    setDraft((prev) => ({
      ...prev,
      detail: { ...prev.detail, ...patch },
    }));
  }

  function handleSaveForm(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.name.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    const slug = draft.slug.trim() || slugifyPropertyName(draft.name);
    const normalizedDetail = normalizeDetailForForm(draft.detail);
    const entry: PropertyListingStored = {
      ...draft,
      slug,
      name: draft.name.trim(),
      hasOffer: draft.comingSoon || draft.hidden ? false : Boolean(draft.hasOffer),
      isPopular:
        draft.comingSoon || draft.hidden ? false : Boolean(draft.isPopular),
      elfsightReviewsAppId:
        parseElfsightAppId(
          draft.elfsightReviewsAppId ?? elfsightEmbedInput,
        ) || undefined,
      detail: {
        ...normalizedDetail,
        poiLines: (normalizedDetail.poiLines ?? [])
          .map((line) => line.trim())
          .filter(Boolean),
        tags: (normalizedDetail.tags ?? []).map((t) => t.trim()).filter(Boolean),
      },
    };
    if (!entry.elfsightReviewsAppId) {
      delete entry.elfsightReviewsAppId;
    }

    let nextListings: PropertyListingStored[];
    let nextFeatured = [...featuredSlugs];

    if (view.mode === "new") {
      if (listings.some((p) => p.slug === slug)) {
        setError("Ya existe una propiedad con ese slug.");
        return;
      }
      nextListings = [...listings, entry];
    } else if (view.mode === "edit") {
      const oldSlug = listings[view.index]?.slug;
      if (listings.some((p, i) => p.slug === slug && i !== view.index)) {
        setError("Ya existe otra propiedad con ese slug.");
        return;
      }
      nextListings = listings.map((item, i) => (i === view.index ? entry : item));
      if (oldSlug && oldSlug !== slug) {
        nextFeatured = nextFeatured.map((s) => (s === oldSlug ? slug : s));
      }
    } else {
      return;
    }

    if (entry.comingSoon || entry.hidden) {
      nextFeatured = nextFeatured.filter((s) => s !== slug);
    }

    const uploads: {
      image?: { file: File; slug: string };
      gallery?: { files: File[]; slug: string };
      units?: { files: Record<string, File>; slug: string };
    } = {};
    if (imageFile) uploads.image = { file: imageFile, slug };
    if (galleryFiles.length) uploads.gallery = { files: galleryFiles, slug };
    if (Object.keys(unitImageFiles).length) {
      uploads.units = { files: unitImageFiles, slug };
    }

    persist(
      nextListings,
      nextFeatured,
      uploads.image || uploads.gallery || uploads.units ? uploads : undefined,
      () => setView({ mode: "list" }),
    );
  }

  /** Sale del editor; si hay cambios sin guardar, pide confirmación. */
  function leaveEditor() {
    if (dirty && !window.confirm("Tenés cambios sin guardar. ¿Salir sin guardar?")) return;
    markSaved();
    setView({ mode: "list" });
  }

  function matchesFilter(item: PropertyListingStored, filter: ListFilter): boolean {
    switch (filter) {
      case "live":
        return !item.hidden && !item.comingSoon;
      case "hidden":
        return Boolean(item.hidden);
      case "featured":
        return featuredSlugs.includes(item.slug);
      case "incomplete":
        return !item.comingSoon && propertyCompleteness(item).score < 100;
      default:
        return true;
    }
  }

  const normalizedQuery = query.trim().toLowerCase();
  const visibleRows = listings
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => matchesFilter(item, statusFilter))
    .filter(({ item }) =>
      !normalizedQuery
        ? true
        : [item.name, item.neighborhood, item.city, item.address, item.slug]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery),
    );

  if (view.mode === "edit" || view.mode === "new") {
    const isNew = view.mode === "new";
    const tagsText = textFromLines(draft.detail?.tags);
    const poiLines = draft.detail?.poiLines ?? [];
    const relatedText = textFromLines(draft.detail?.relatedSlugs);
    const stats = draft.detail?.stats ?? [];
    const units = draft.detail?.units ?? [];

    return (
      <div className="page-editor w-full">
        <button type="button" className="admin-editor-back" onClick={leaveEditor}>
          ← Volver al listado
        </button>

        <header className="admin-page-header flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="admin-eyebrow">{isNew ? "Nuevo edificio" : "Editar edificio"}</p>
            <h1 className="mt-1">{isNew ? "Nueva propiedad" : draft.name || "Sin nombre"}</h1>
            <p>
              {isNew
                ? "Completá los datos y guardá para publicar en el sitio."
                : "Los cambios se publican al guardar."}
              {" · "}
              Editando {language === "en" ? "inglés" : "español"}
              {!isNew && draft.slug ? (
                <>
                  {" · "}
                  <a href={`/propiedades/${draft.slug}`} target="_blank" rel="noopener noreferrer">
                    Ver ficha publicada ↗
                  </a>
                </>
              ) : null}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <SaveState dirty={dirty} />
            <AdminLanguageSwitcher language={language} />
          </div>
        </header>

        {error ? (
          <p className="admin-alert-error mb-6" role="alert">
            {error}
          </p>
        ) : null}

        <div className="admin-editor-layout">
        <form ref={editorFormRef} onSubmit={handleSaveForm} className="flex min-w-0 flex-col gap-8">
          <section id={sectionAnchorId("Imagen de listado")}>
            <h2 className="admin-form-section-label">Imagen de listado</h2>
            <p className="mb-4 text-sm text-[var(--admin-text-dim)]">
              Miniatura en home y grilla de propiedades.
            </p>
            <div className="admin-image-upload-row">
              <div className="admin-image-upload-row__preview">
                {draft.imageSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={draft.imageSrc} alt="" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-[var(--admin-text-dim)]">
                    Sin imagen
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                  className="mb-3"
                />
                <MediaUploadGuide
                  guide={MEDIA_UPLOAD_GUIDES.propertyListing}
                  className="max-w-md"
                />
              </div>
            </div>
          </section>

          <section id={sectionAnchorId("Galería (ficha del edificio)")}>
            <h2 className="admin-form-section-label">Galería (ficha del edificio)</h2>
            <p className="mb-4 text-sm text-[var(--admin-text-dim)]">
              Carrusel principal (izquierda) y dos fotos laterales. Orden: la 1.ª
              es la principal del carrusel; la 2.ª y 3.ª van a la derecha. Si no
              hay galería, se usa la imagen de listado.
            </p>
            {(draft.detail?.galleryImages ?? []).length > 0 ? (
              <ul className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {(draft.detail?.galleryImages ?? []).map((src, imageIndex) => (
                  <li
                    key={`${src}-${imageIndex}`}
                    className="relative overflow-hidden rounded-lg border border-[var(--admin-border)]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="aspect-[4/3] w-full object-cover" />
                    <button
                      type="button"
                      className="absolute right-2 top-2 rounded-md bg-black/60 px-2 py-1 text-xs text-white hover:bg-black/80"
                      onClick={() =>
                        updateDetail({
                          galleryImages: (draft.detail?.galleryImages ?? []).filter(
                            (_, i) => i !== imageIndex,
                          ),
                        })
                      }
                    >
                      Quitar
                    </button>
                    <span className="absolute bottom-2 left-2 rounded bg-black/50 px-1.5 py-0.5 text-[10px] text-white">
                      {imageIndex + 1}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mb-4 text-sm text-[var(--admin-text-dim)]">
                Sin fotos en la galería.
              </p>
            )}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={(e) =>
                setGalleryFiles(Array.from(e.target.files ?? []))
              }
              className="mb-2"
            />
            {galleryFiles.length > 0 ? (
              <p className="text-sm text-[var(--admin-text-dim)]">
                {galleryFiles.length} archivo(s) nuevo(s) — se suben al guardar.
              </p>
            ) : null}
            <MediaUploadGuide
              guide={MEDIA_UPLOAD_GUIDES.propertyGallery}
              className="mt-3 max-w-md"
            />
          </section>

          <section id={sectionAnchorId("Información general")}>
            <h2 className="admin-form-section-label">Información general</h2>
            <div className="grid gap-5 lg:grid-cols-2">
              <label className="flex flex-col lg:col-span-2">
                <span className="admin-field-label">Nombre *</span>
                <input
                  type="text"
                  required
                  value={draft.name}
                  onChange={(e) => updateDraft({ name: e.target.value })}
                  className="admin-input"
                  placeholder="Downtown — Torre Bellini"
                />
              </label>
              <label className="flex flex-col lg:col-span-2">
                <span className="admin-field-label">Subtítulo (ficha)</span>
                <input
                  type="text"
                  value={draft.detail?.subtitle ?? ""}
                  onChange={(e) => updateDetail({ subtitle: e.target.value })}
                  className="admin-input"
                  placeholder="Escala y confort en el corazón financiero…"
                />
              </label>
              <label className="flex flex-col">
                <span className="admin-field-label">Ciudad</span>
                <select
                  value={
                    initial.cityOptions.includes(draft.city)
                      ? draft.city
                      : defaultCity
                  }
                  onChange={(e) => updateDraft({ city: e.target.value })}
                  className="admin-input"
                >
                  {initial.cityOptions.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col">
                <span className="admin-field-label">Barrio</span>
                <input
                  type="text"
                  value={draft.neighborhood}
                  onChange={(e) => updateDraft({ neighborhood: e.target.value })}
                  className="admin-input"
                />
              </label>
              <label className="flex flex-col lg:col-span-2">
                <span className="admin-field-label">Dirección</span>
                <input
                  type="text"
                  value={draft.address}
                  onChange={(e) => updateDraft({ address: e.target.value })}
                  className="admin-input"
                />
              </label>
              <label className="flex flex-col">
                <span className="admin-field-label">ID GNAHS (motor)</span>
                <select
                  value={draft.gnahsId}
                  onChange={(e) => updateDraft({ gnahsId: Number(e.target.value) })}
                  className="admin-input"
                >
                  <option value={0}>— Sin motor —</option>
                  {initial.gnahsOptions.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.id} — {h.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col">
                <span className="admin-field-label">Slug (URL)</span>
                <span className="admin-field-hint">/propiedades/{draft.slug || "…"}</span>
                <input
                  type="text"
                  value={draft.slug}
                  onChange={(e) => updateDraft({ slug: e.target.value })}
                  className="admin-input font-mono text-sm"
                />
              </label>
            </div>
          </section>

          <section id={sectionAnchorId("Reseñas Google (Elfsight)")}>
            <h2 className="admin-form-section-label">
              Reseñas Google (Elfsight)
            </h2>
            <p className="mb-4 text-sm text-[var(--admin-text-dim)]">
              Un widget por torre. En Elfsight creá el carrusel de esa propiedad y
              pegá acá el código de inserción completo. Si no hay código, la
              sección no se muestra en la ficha.
            </p>
            <label className="flex flex-col">
              <span className="admin-field-label">Código de inserción</span>
              <textarea
                rows={5}
                value={elfsightEmbedInput}
                onChange={(e) => {
                  const value = e.target.value;
                  setElfsightEmbedInput(value);
                  const id = parseElfsightAppId(value);
                  updateDraft({
                    elfsightReviewsAppId: id || undefined,
                  });
                }}
                className="admin-textarea font-mono text-sm"
                placeholder={`<!-- Elfsight Google Reviews -->\n<script src="https://elfsightcdn.com/platform.js" async></script>\n<div class="elfsight-app-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" data-elfsight-app-lazy></div>`}
              />
              {draft.elfsightReviewsAppId ? (
                <span className="admin-field-hint mt-2 mb-0">
                  Widget detectado:{" "}
                  <code className="text-xs">{draft.elfsightReviewsAppId}</code>
                </span>
              ) : elfsightEmbedInput.trim() ? (
                <span className="admin-field-hint mt-2 mb-0 text-amber-700">
                  No se detectó un App ID válido. Pegá el snippet completo de
                  Elfsight (incluye la clase elfsight-app-…).
                </span>
              ) : (
                <span className="admin-field-hint mt-2 mb-0">
                  Vacío = sin carrusel de Google en esta ficha.
                </span>
              )}
            </label>
          </section>

          <section id={sectionAnchorId("Descripción")}>
            <h2 className="admin-form-section-label">Descripción</h2>
            <label className="flex flex-col">
              <span className="admin-field-label">
                Texto (párrafos separados por línea en blanco)
              </span>
              <textarea
                rows={8}
                value={draft.detail?.about ?? ""}
                onChange={(e) => updateDetail({ about: e.target.value })}
                className="admin-textarea"
                placeholder="Torre Bellini es el edificio insignia de Top Rentals…"
              />
            </label>
          </section>

          <section id={sectionAnchorId("Etiquetas")}>
            <h2 className="admin-form-section-label">Etiquetas</h2>
            <label className="flex flex-col">
              <span className="admin-field-label">Etiquetas (uno por línea)</span>
              <textarea
                rows={4}
                value={tagsText}
                onChange={(e) => updateDetail({ tags: linesFromText(e.target.value) })}
                className="admin-textarea"
                placeholder={"+270 Huéspedes\n45 Pisos\nMicrocentro"}
              />
            </label>
          </section>

          <section id={sectionAnchorId("Puntos de interés cercanos")}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="admin-form-section-label mb-1">
                  Puntos de interés cercanos
                </h2>
                <p className="text-sm text-[var(--admin-text-muted)]">
                  Agregá todos los que quieras. Para mostrar foto, escribí el nombre y la
                  URL separados por «|» (ej. «El Monumental | /uploads/monumental.jpg»).
                  Las fotos se suben en Admin → Imágenes.
                </p>
              </div>
              <button
                type="button"
                className="admin-btn-secondary text-sm"
                onClick={() =>
                  updateDetail({ poiLines: [...poiLines, ""] })
                }
              >
                + Agregar punto
              </button>
            </div>
            {poiLines.length === 0 ? (
              <p className="text-sm text-[var(--admin-text-dim)]">
                Sin puntos cargados — usá «Agregar punto» para el primero.
              </p>
            ) : (
              <ul className="flex flex-col gap-3">
                {poiLines.map((place, poiIndex) => (
                  <li
                    key={poiIndex}
                    className="flex flex-wrap items-center gap-2 sm:flex-nowrap"
                  >
                    <span
                      className="hidden w-6 shrink-0 text-center text-xs text-[var(--admin-text-dim)] sm:block"
                      aria-hidden
                    >
                      {poiIndex + 1}
                    </span>
                    <input
                      type="text"
                      value={place}
                      onChange={(e) => {
                        const next = poiLines.map((p, i) =>
                          i === poiIndex ? e.target.value : p,
                        );
                        updateDetail({ poiLines: next });
                      }}
                      className="admin-input min-w-0 flex-1"
                      placeholder="Ej. Puerto Madero | /uploads/puerto-madero.jpg"
                    />
                    <button
                      type="button"
                      className="admin-btn-danger shrink-0 text-sm"
                      onClick={() =>
                        updateDetail({
                          poiLines: poiLines.filter((_, i) => i !== poiIndex),
                        })
                      }
                      aria-label={`Quitar ${place || "punto"}`}
                    >
                      Quitar
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section id={sectionAnchorId("Franja corporativa y estadísticas")}>
            <h2 className="admin-form-section-label">
              Franja corporativa y estadísticas
            </h2>
            <p className="mb-4 text-sm text-[var(--admin-text-muted)]">
              Bloque negro de la ficha: título, párrafo, botón y cuatro cifras
              (Unidades, Pisos, Huéspedes, Seguridad 24/7).
            </p>
            <div className="grid gap-5 lg:grid-cols-2">
              <label className="flex flex-col lg:col-span-2">
                <span className="admin-field-label">Título de la franja</span>
                <input
                  type="text"
                  value={draft.detail?.groupsHeadline ?? ""}
                  onChange={(e) => updateDetail({ groupsHeadline: e.target.value })}
                  className="admin-input"
                  placeholder="134 unidades · Grupos de más de 270 personas"
                />
              </label>
              <label className="flex flex-col lg:col-span-2">
                <span className="admin-field-label">Párrafo descriptivo</span>
                <textarea
                  rows={3}
                  value={draft.detail?.groupsDescription ?? ""}
                  onChange={(e) =>
                    updateDetail({ groupsDescription: e.target.value })
                  }
                  className="admin-textarea"
                  placeholder="Downtown forma parte del portfolio de Top Rentals…"
                />
              </label>
              <label className="flex flex-col">
                <span className="admin-field-label">Texto del botón</span>
                <input
                  type="text"
                  value={draft.detail?.groupsCtaLabel ?? ""}
                  onChange={(e) => updateDetail({ groupsCtaLabel: e.target.value })}
                  className="admin-input"
                />
              </label>
              <label className="flex flex-col">
                <span className="admin-field-label">Enlace del botón</span>
                <input
                  type="text"
                  value={draft.detail?.groupsCtaHref ?? ""}
                  onChange={(e) => updateDetail({ groupsCtaHref: e.target.value })}
                  className="admin-input"
                  placeholder="/corporate"
                />
              </label>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, statIndex) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface-raised)] p-3"
                >
                  <span className="admin-field-label">{stat.label}</span>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => {
                      const next = stats.map((s, i) =>
                        i === statIndex ? { ...s, value: e.target.value } : s,
                      );
                      updateDetail({ stats: next });
                    }}
                    className="admin-input mt-2"
                    placeholder={
                      stat.label === "Seguridad 24/7"
                        ? "24/7"
                        : stat.label === "Huéspedes"
                          ? "+270"
                          : stat.label === "Pisos"
                            ? "45"
                            : "134"
                    }
                  />
                </div>
              ))}
            </div>
          </section>

          <section id={sectionAnchorId("Unidades")}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="admin-form-section-label mb-0">Unidades</h2>
                <p className="admin-field-hint mt-1">
                  Usá ↑ ↓ para cambiar el orden. Así se muestran en la ficha pública.
                </p>
              </div>
              <button
                type="button"
                className="admin-btn-secondary text-sm"
                onClick={() =>
                  updateDetail({ units: [...units, emptyUnit()] })
                }
              >
                + Agregar unidad
              </button>
            </div>
            {units.length === 0 ? (
              <p className="text-sm text-[var(--admin-text-dim)]">
                Sin unidades — agregá tipologías y el link del tour 360° si aplica.
              </p>
            ) : (
              <ul className="flex flex-col gap-4">
                {units.map((unit, unitIndex) => (
                  <li
                    key={unitIndex}
                    className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface-raised)] p-4"
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          className="admin-btn-ghost px-2 py-1 text-xs"
                          disabled={unitIndex === 0}
                          onClick={() => {
                            if (unitIndex === 0) return;
                            const next = [...units];
                            const prev = next[unitIndex - 1]!;
                            next[unitIndex - 1] = next[unitIndex]!;
                            next[unitIndex] = prev;
                            updateDetail({ units: next });
                          }}
                          aria-label={`Subir unidad ${unit.name || unitIndex + 1}`}
                          title="Subir"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          className="admin-btn-ghost px-2 py-1 text-xs"
                          disabled={unitIndex >= units.length - 1}
                          onClick={() => {
                            if (unitIndex >= units.length - 1) return;
                            const next = [...units];
                            const curr = next[unitIndex]!;
                            next[unitIndex] = next[unitIndex + 1]!;
                            next[unitIndex + 1] = curr;
                            updateDetail({ units: next });
                          }}
                          aria-label={`Bajar unidad ${unit.name || unitIndex + 1}`}
                          title="Bajar"
                        >
                          ↓
                        </button>
                        <span className="ml-2 text-xs text-[var(--admin-text-dim)]">
                          {unitIndex + 1} / {units.length}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="admin-btn-danger text-sm"
                        onClick={() =>
                          updateDetail({
                            units: units.filter((_, i) => i !== unitIndex),
                          })
                        }
                      >
                        Quitar
                      </button>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="flex flex-col sm:col-span-2">
                        <span className="admin-field-label">Nombre</span>
                        <input
                          type="text"
                          value={unit.name}
                          onChange={(e) => {
                            const next = units.map((u, i) =>
                              i === unitIndex ? { ...u, name: e.target.value } : u,
                            );
                            updateDetail({ units: next });
                          }}
                          className="admin-input"
                          placeholder="Tres Ambientes"
                        />
                      </label>
                      <label className="flex flex-col">
                        <span className="admin-field-label">Metros</span>
                        <input
                          type="text"
                          value={unit.sqm}
                          onChange={(e) => {
                            const next = units.map((u, i) =>
                              i === unitIndex ? { ...u, sqm: e.target.value } : u,
                            );
                            updateDetail({ units: next });
                          }}
                          className="admin-input"
                          placeholder="68–75 m²"
                        />
                      </label>
                      <label className="flex flex-col">
                        <span className="admin-field-label">Huéspedes</span>
                        <input
                          type="text"
                          value={unit.guests}
                          onChange={(e) => {
                            const next = units.map((u, i) =>
                              i === unitIndex ? { ...u, guests: e.target.value } : u,
                            );
                            updateDetail({ units: next });
                          }}
                          className="admin-input"
                          placeholder="Hasta 5 huéspedes"
                        />
                      </label>
                      <label className="flex flex-col sm:col-span-2">
                        <span className="admin-field-label">Detalle</span>
                        <input
                          type="text"
                          value={unit.features}
                          onChange={(e) => {
                            const next = units.map((u, i) =>
                              i === unitIndex
                                ? { ...u, features: e.target.value }
                                : u,
                            );
                            updateDetail({ units: next });
                          }}
                          className="admin-input"
                          placeholder="Ideal familias · Dos baños"
                        />
                      </label>
                      <label className="flex flex-col sm:col-span-2">
                        <span className="admin-field-label">Tour 360° (URL Matterport)</span>
                        <input
                          type="url"
                          value={unit.tourUrl ?? ""}
                          onChange={(e) => {
                            const next = units.map((u, i) =>
                              i === unitIndex
                                ? { ...u, tourUrl: e.target.value }
                                : u,
                            );
                            updateDetail({ units: next });
                          }}
                          className="admin-input font-mono text-xs"
                          placeholder="https://my.matterport.com/show/?m=..."
                        />
                      </label>
                      <div className="flex flex-col gap-2 sm:col-span-2">
                        <span className="admin-field-label">Foto de la unidad</span>
                        <span className="admin-field-hint">
                          Franja horizontal bajo la tarjeta. Recomendado 900×300 px, JPG/PNG/WebP, máx. 2 MB.
                          Se sube al guardar.
                        </span>
                        {unit.imageSrc ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={unit.imageSrc}
                            alt=""
                            className="aspect-[420/100] w-full max-w-md rounded-md border border-[var(--admin-border)] object-cover"
                          />
                        ) : null}
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          disabled={!unit.name.trim()}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            const key = unit.name.trim();
                            setUnitImageFiles((prev) => {
                              const next = { ...prev };
                              if (file) next[key] = file;
                              else delete next[key];
                              return next;
                            });
                          }}
                          className="text-sm"
                        />
                        {unitImageFiles[unit.name.trim()] ? (
                          <span className="text-xs text-[var(--admin-text-dim)]">
                            Archivo nuevo: {unitImageFiles[unit.name.trim()]!.name}
                          </span>
                        ) : null}
                      </div>
                      <label className="flex flex-col sm:col-span-2">
                        <span className="admin-field-label">…o URL de la foto</span>
                        <input
                          type="text"
                          value={unit.imageSrc ?? ""}
                          onChange={(e) => {
                            const next = units.map((u, i) =>
                              i === unitIndex
                                ? { ...u, imageSrc: e.target.value }
                                : u,
                            );
                            updateDetail({ units: next });
                          }}
                          className="admin-input font-mono text-xs"
                          placeholder="/uploads/unidad-studio.jpg"
                        />
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section id={sectionAnchorId("Diseño de la ficha")}>
            <h2 className="admin-form-section-label">Diseño de la ficha</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col">
                <span className="admin-field-label">Foto de la franja con el nombre (URL)</span>
                <span className="admin-field-hint">
                  Recomendado 1920×500 px (fachada). Vacío = primera foto de la galería.
                </span>
                <input
                  type="text"
                  value={draft.detail?.bannerImage ?? ""}
                  onChange={(e) => updateDetail({ bannerImage: e.target.value })}
                  className="admin-input font-mono text-xs"
                  placeholder="/uploads/fachada.jpg"
                />
              </label>
              <label className="flex flex-col">
                <span className="admin-field-label">Título de la franja</span>
                <span className="admin-field-hint">
                  Vacío = nombre del edificio. Cursiva: {"<em>Núñez</em> Hub"}.
                </span>
                <input
                  type="text"
                  value={draft.detail?.bannerTitle ?? ""}
                  onChange={(e) => updateDetail({ bannerTitle: e.target.value })}
                  className="admin-input"
                  placeholder="<em>Núñez</em> Hub"
                />
              </label>
              <label className="flex flex-col">
                <span className="admin-field-label">Etiquetas de la franja (una por línea)</span>
                <span className="admin-field-hint">
                  Vacío = se arman con las cifras (Unidades, Huéspedes) y las etiquetas.
                </span>
                <textarea
                  rows={4}
                  value={textFromLines(draft.detail?.bannerPills ?? [])}
                  onChange={(e) =>
                    updateDetail({ bannerPills: linesFromText(e.target.value) })
                  }
                  className="admin-input"
                  placeholder={"29 Unidades\nHasta 60 pax\nNúñez\nCorporativo"}
                />
              </label>
              <label className="flex flex-col sm:col-span-2">
                <span className="admin-field-label">Título de la franja final</span>
                <span className="admin-field-hint">
                  Franja roja con «Reservar ahora». Cursiva: {"<em>moderno</em>"}.
                </span>
                <input
                  type="text"
                  value={draft.detail?.finalCtaTitle ?? ""}
                  onChange={(e) => updateDetail({ finalCtaTitle: e.target.value })}
                  className="admin-input"
                  placeholder="Estratégico, <em>moderno</em> y a pasos de todo en Núñez"
                />
              </label>
              <label className="flex flex-col">
                <span className="admin-field-label">Franja bajo el título — frase</span>
                <span className="admin-field-hint">{"Ej. «¿Necesitás alojar un grupo grande en Buenos Aires?»"}</span>
                <input
                  type="text"
                  value={draft.detail?.introText ?? ""}
                  onChange={(e) => updateDetail({ introText: e.target.value })}
                  className="admin-input"
                />
              </label>
              <label className="flex flex-col">
                <span className="admin-field-label">Franja bajo el título — botón</span>
                <span className="admin-field-hint">{"Ej. «Consultar grupos». Si menciona grupos, lleva a la página de grupos."}</span>
                <input
                  type="text"
                  value={draft.detail?.introCtaLabel ?? ""}
                  onChange={(e) => updateDetail({ introCtaLabel: e.target.value })}
                  className="admin-input"
                />
              </label>
              <label className="flex flex-col">
                <span className="admin-field-label">Título de «Sobre el edificio»</span>
                <span className="admin-field-hint">{"Vacío = «Sobre el edificio». Cursiva con <em>."}</span>
                <input
                  type="text"
                  value={draft.detail?.aboutTitle ?? ""}
                  onChange={(e) => updateDetail({ aboutTitle: e.target.value })}
                  className="admin-input"
                />
              </label>
              <label className="flex flex-col">
                <span className="admin-field-label">Banda destacada — título</span>
                <span className="admin-field-hint">{"Banda oscura opcional (ej. vistas o piscina)."}</span>
                <input
                  type="text"
                  value={draft.detail?.highlightTitle ?? ""}
                  onChange={(e) => updateDetail({ highlightTitle: e.target.value })}
                  className="admin-input"
                />
              </label>
              <label className="flex flex-col">
                <span className="admin-field-label">Banda destacada — texto chico</span>
                <input
                  type="text"
                  value={draft.detail?.highlightText ?? ""}
                  onChange={(e) => updateDetail({ highlightText: e.target.value })}
                  className="admin-input"
                />
              </label>
              <label className="flex flex-col">
                <span className="admin-field-label">Título de restaurantes</span>
                <span className="admin-field-hint">{"Vacío = «Restaurantes»."}</span>
                <input
                  type="text"
                  value={draft.detail?.restaurantsTitle ?? ""}
                  onChange={(e) => updateDetail({ restaurantsTitle: e.target.value })}
                  className="admin-input"
                />
              </label>
              <label className="flex flex-col">
                <span className="admin-field-label">Línea bajo «Unidades disponibles»</span>
                <span className="admin-field-hint">{"Vacío = resumen automático (modelos · unidades · huéspedes)."}</span>
                <input
                  type="text"
                  value={draft.detail?.unitsIntro ?? ""}
                  onChange={(e) => updateDetail({ unitsIntro: e.target.value })}
                  className="admin-input"
                />
              </label>
              <label className="flex flex-col">
                <span className="admin-field-label">Línea bajo «Amenities & servicios»</span>
                <input
                  type="text"
                  value={draft.detail?.amenitiesIntro ?? ""}
                  onChange={(e) => updateDetail({ amenitiesIntro: e.target.value })}
                  className="admin-input"
                />
              </label>
              <label className="flex flex-col">
                <span className="admin-field-label">Franja final — subtítulo</span>
                <input
                  type="text"
                  value={draft.detail?.finalCtaSubtitle ?? ""}
                  onChange={(e) => updateDetail({ finalCtaSubtitle: e.target.value })}
                  className="admin-input"
                />
              </label>
              <label className="flex flex-col">
                <span className="admin-field-label">Franja final — botón</span>
                <span className="admin-field-hint">{"Vacío = «Reservar ahora»."}</span>
                <input
                  type="text"
                  value={draft.detail?.finalCtaLabel ?? ""}
                  onChange={(e) => updateDetail({ finalCtaLabel: e.target.value })}
                  className="admin-input"
                />
              </label>
              <label className="flex flex-col sm:col-span-2">
                <span className="admin-field-label">Restaurantes cercanos (uno por línea)</span>
                <textarea
                  rows={4}
                  value={textFromLines(draft.detail?.restaurants ?? [])}
                  onChange={(e) =>
                    updateDetail({ restaurants: linesFromText(e.target.value) })
                  }
                  className="admin-input"
                  placeholder={"La Escondida\nDandy Saavedra"}
                />
              </label>
            </div>
            <label className="mt-5 flex flex-col">
              <span className="admin-field-label">Amenities y servicios (uno por línea)</span>
              <span className="admin-field-hint">
                Escribilos como se muestran (ej. «Piscina con jardín»). El ícono se elige solo por
                palabra: piscina, spa/sauna, gym/gimnasio, SUM/sala de reuniones, cowork, lavandería,
                limpieza, wifi, cocheras/estacionamiento, seguridad, solarium, terraza/rooftop,
                recepción/concierge, TV, pet, comida, desayuno, traslados, lobby, playroom, A/C.
              </span>
              <textarea
                rows={6}
                value={textFromLines(normalizeAmenities(draft.detail?.amenities))}
                onChange={(e) => updateDetail({ amenities: linesFromText(e.target.value) })}
                className="admin-input"
                placeholder={"Piscina\nSpa / Sauna\nGym\nSUM · Sala de Reuniones"}
              />
            </label>
          </section>

          <section id={sectionAnchorId("SEO (Google)")}>
            <h2 className="admin-form-section-label">SEO (Google)</h2>
            <p className="mb-4 text-sm text-[var(--admin-text-muted)]">
              Cómo aparece la ficha en Google y al compartir el link. Si los dejás vacíos se arman
              solos: «{draft.name.replace(/^Top Rentals\s+/i, "") || "Edificio"} — Departamentos temporarios en
              {" "}
              {[draft.neighborhood, draft.city].filter(Boolean).join(", ")}» y la descripción del edificio.
            </p>
            <div className="grid gap-4">
              <label className="flex flex-col">
                <span className="admin-field-label">
                  Título en Google{" "}
                  <span className="font-normal text-[var(--admin-text-dim)]">
                    ({(draft.detail?.seoTitle ?? "").length}/60)
                  </span>
                </span>
                <input
                  type="text"
                  value={draft.detail?.seoTitle ?? ""}
                  onChange={(e) => updateDetail({ seoTitle: e.target.value })}
                  className="admin-input"
                  maxLength={90}
                  placeholder="Automático"
                />
              </label>
              <label className="flex flex-col">
                <span className="admin-field-label">
                  Descripción en Google{" "}
                  <span className="font-normal text-[var(--admin-text-dim)]">
                    ({(draft.detail?.seoDescription ?? "").length}/155)
                  </span>
                </span>
                <textarea
                  rows={3}
                  value={draft.detail?.seoDescription ?? ""}
                  onChange={(e) => updateDetail({ seoDescription: e.target.value })}
                  className="admin-input"
                  maxLength={300}
                  placeholder="Automática (texto de «Sobre el edificio»)"
                />
              </label>
            </div>
          </section>

          <section id={sectionAnchorId("Otras propiedades sugeridas")}>
            <h2 className="admin-form-section-label">Otras propiedades sugeridas</h2>
            <label className="flex flex-col">
              <span className="admin-field-label">Slugs (uno por línea, opcional)</span>
              <span className="admin-field-hint">
                Ej. huergo-475, palermo-soho. Si está vacío, el sitio elige automáticamente.
              </span>
              <textarea
                rows={3}
                value={relatedText}
                onChange={(e) =>
                  updateDetail({ relatedSlugs: linesFromText(e.target.value) })
                }
                className="admin-textarea"
                placeholder="huergo-475"
              />
            </label>
          </section>

          <section id={sectionAnchorId("Opciones")}>
            <h2 className="admin-form-section-label">Opciones</h2>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3 text-sm text-[var(--admin-text-muted)]">
                <input
                  type="checkbox"
                  checked={featuredSlugs.includes(draft.slug)}
                  disabled={
                    draft.comingSoon ||
                    draft.hidden ||
                    (!featuredSlugs.includes(draft.slug) && featuredSlugs.length >= 5)
                  }
                  onChange={() => {
                    const slug = draft.slug;
                    if (!slug) return;
                    setFeaturedSlugs((prev) =>
                      prev.includes(slug)
                        ? prev.filter((s) => s !== slug)
                        : prev.length < 5
                          ? [...prev, slug]
                          : prev,
                    );
                  }}
                />
                Destacada en la home (máx. 5)
              </label>
              <label className="flex items-center gap-3 text-sm text-[var(--admin-text-muted)]">
                <input
                  type="checkbox"
                  checked={draft.comingSoon ?? false}
                  onChange={(e) => updateDraft({ comingSoon: e.target.checked })}
                />
                Próximamente (sin ficha propia)
              </label>
              <label className="flex items-center gap-3 text-sm text-[var(--admin-text-muted)]">
                <input
                  type="checkbox"
                  checked={draft.hasOffer ?? false}
                  disabled={draft.comingSoon || draft.hidden}
                  onChange={(e) => updateDraft({ hasOffer: e.target.checked })}
                />
                Con oferta — sello naranja en home, listado y ficha
              </label>
              <label className="flex items-center gap-3 text-sm text-[var(--admin-text-muted)]">
                <input
                  type="checkbox"
                  checked={draft.isPopular ?? false}
                  disabled={draft.comingSoon || draft.hidden}
                  onChange={(e) => updateDraft({ isPopular: e.target.checked })}
                />
                Más solicitada — sello azul en home, listado y ficha
              </label>
              <label className="flex items-center gap-3 text-sm text-[var(--admin-text-muted)]">
                <input
                  type="checkbox"
                  checked={draft.isExclusive ?? false}
                  disabled={draft.comingSoon || draft.hidden}
                  onChange={(e) => updateDraft({ isExclusive: e.target.checked })}
                />
                Unidades exclusivas — aparece en el filtro «Unidades exclusivas» del listado
              </label>
              <fieldset className="mt-2">
                <legend className="mb-2 text-sm font-medium">
                  Ideal para (filtro «Disponibilidad» del listado)
                </legend>
                <div className="flex flex-wrap gap-5">
                  {PROPERTY_AUDIENCES.map((audience) => (
                    <label
                      key={audience}
                      className="flex items-center gap-2 text-sm text-[var(--admin-text-muted)]"
                    >
                      <input
                        type="checkbox"
                        checked={draft.audience?.includes(audience) ?? false}
                        disabled={draft.comingSoon || draft.hidden}
                        onChange={(e) => {
                          const current = draft.audience ?? [];
                          updateDraft({
                            audience: e.target.checked
                              ? [...current, audience]
                              : current.filter((a) => a !== audience),
                          });
                        }}
                      />
                      {AUDIENCE_ADMIN_LABELS[audience]}
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
          </section>

          <div className="admin-form-actions">
            <button type="submit" disabled={pending} className="admin-btn-primary">
              {pending ? "Guardando…" : "Guardar"}
            </button>
            <button type="button" className="admin-btn-secondary" onClick={leaveEditor}>
              Cancelar
            </button>
            <span className="ml-auto">
              <SaveState dirty={dirty} />
            </span>
          </div>
        </form>
        <EditorToc items={PROPERTY_EDITOR_TOC} />
        </div>
      </div>
    );
  }

  return (
    <div className="page-editor w-full">
      <header className="admin-page-header flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="admin-eyebrow">Edificios</p>
          <h1 className="mt-1">Fichas de edificios</h1>
          <p>
            Agregá, editá, ocultá o eliminá edificios.
            Aparecen en{" "}
            <a href="/propiedades" target="_blank" rel="noopener noreferrer">
              /propiedades
            </a>{" "}
            y en la home si están destacadas.
            {" · "}
            Editando {language === "en" ? "inglés" : "español"}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <AdminLanguageSwitcher language={language} />
          <button type="button" className="admin-btn-primary shrink-0" onClick={openNew}>
            + Nueva propiedad
          </button>
        </div>
      </header>

      {error ? (
        <p className="admin-alert-error mb-6" role="alert">
          {error}
        </p>
      ) : null}
      {success ? <p className="admin-alert-success mb-6">{success}</p> : null}

      {listings.length === 0 ? (
        <p className="admin-empty">
          Todavía no hay propiedades. Creá la primera con «Nueva propiedad».
        </p>
      ) : (
        <>
          <div className="admin-list-toolbar">
            <label className="admin-search">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="admin-input"
                placeholder="Buscar por nombre, barrio o ciudad…"
                aria-label="Buscar edificios"
              />
            </label>
            <div className="admin-chips" role="group" aria-label="Filtrar">
              {LIST_FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className="admin-chip"
                  aria-pressed={statusFilter === f.id}
                  onClick={() => setStatusFilter(f.id)}
                >
                  {f.label}
                  <span className="admin-chip__count">
                    {listings.filter((item) => matchesFilter(item, f.id)).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {visibleRows.length === 0 ? (
            <p className="admin-empty">No hay edificios que coincidan con la búsqueda.</p>
          ) : (
            <ul className="admin-list">
              {visibleRows.map(({ item, index }) => {
                const status = propertyStatus(item);
                const meta = [item.city, item.neighborhood, item.address]
                  .filter(Boolean)
                  .join(" · ");
                const thumb = item.imageSrc || item.detail?.galleryImages?.[0] || "";
                const completeness = item.comingSoon ? null : propertyCompleteness(item);

                return (
                  <li key={`${item.slug}-${index}`} className="admin-list-card">
                    <div className="admin-list-card__main">
                      {thumb ? (
                        <span className="admin-list-card__thumb">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={thumb} alt="" loading="lazy" />
                        </span>
                      ) : (
                        <span className="admin-list-card__icon" aria-hidden>
                          🏢
                        </span>
                      )}
                      <div className="min-w-0">
                        <button
                          type="button"
                          onClick={() => openEdit(index)}
                          className="admin-list-card__title text-left hover:underline"
                        >
                          {item.name}
                        </button>
                        <div className="admin-list-card__meta-row">
                          <span className={`admin-list-card__badge ${status.className}`}>
                            {status.label}
                          </span>
                          {featuredSlugs.includes(item.slug) ? (
                            <span className="admin-list-card__badge">★ Destacada en home</span>
                          ) : null}
                          {item.hasOffer ? (
                            <span className="admin-list-card__badge">Oferta</span>
                          ) : null}
                          {item.isPopular ? (
                            <span className="admin-list-card__badge">Más solicitada</span>
                          ) : null}
                        </div>
                        <p className="admin-list-card__meta">{meta}</p>
                      </div>
                    </div>
                    {completeness ? (
                      <div
                        className="admin-list-card__progress"
                        title={
                          completeness.missing.length
                            ? `Falta: ${completeness.missing.join(", ")}`
                            : "Ficha completa"
                        }
                      >
                        <span className="admin-completeness__bar">
                          <span
                            style={{ width: `${completeness.score}%` }}
                            className={
                              completeness.score >= 80
                                ? "is-good"
                                : completeness.score >= 50
                                  ? "is-mid"
                                  : "is-low"
                            }
                          />
                        </span>
                        {completeness.score}%
                      </div>
                    ) : null}
                    <div className="admin-list-card__actions">
                      <button
                        type="button"
                        className={`admin-visibility-btn ${item.hidden ? "admin-visibility-btn--off" : ""}`}
                        disabled={pending}
                        onClick={() => toggleVisibility(index)}
                        aria-label={item.hidden ? "Mostrar en el sitio" : "Ocultar del sitio"}
                        title={item.hidden ? "Mostrar en el sitio" : "Ocultar del sitio"}
                      >
                        <IconEye off={item.hidden} />
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
                        onClick={() => removeAt(index)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
