"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { textFromLines, linesFromText } from "@/lib/properties/catalogText";
import type { PropertiesCatalogEditorState } from "@/lib/properties/catalogEditor";
import type { PropertyListingStored } from "@/lib/properties/catalogTypes";
import { slugifyPropertyName } from "@/lib/properties/slugify";
import {
  detailForAdminForm,
  emptyUnit,
  normalizeDetailForForm,
} from "@/lib/properties/detailForm";
import { MEDIA_UPLOAD_GUIDES } from "@/lib/mediaUploadGuide";
import { MediaUploadGuide } from "./MediaUploadGuide";
import { savePropertiesCatalog } from "./propertiesCatalogActions";

type Props = {
  initial: PropertiesCatalogEditorState;
};

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

export function PropertiesCatalogManager({ initial }: Props) {
  const defaultCity = initial.cityOptions[0] ?? "Buenos Aires";
  const router = useRouter();
  const [view, setView] = useState<View>({ mode: "list" });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [listings, setListings] = useState(initial.listings);
  const [featuredSlugs, setFeaturedSlugs] = useState(initial.featuredSlugs);
  const [draft, setDraft] = useState<PropertyListingStored>(emptyListing(defaultCity));
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

  const persist = useCallback(
    (
      nextListings: PropertyListingStored[],
      nextFeatured: string[],
      uploads?: {
        image?: { file: File; slug: string };
        gallery?: { files: File[]; slug: string };
      },
      onDone?: () => void,
    ) => {
      setError(null);
      setSuccess(null);
      const fd = new FormData();
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
        router.refresh();
        onDone?.();
      });
    },
    [router],
  );

  function openNew() {
    setDraft({ ...emptyListing(defaultCity), detail: normalizeDetailForForm() });
    setImageFile(null);
    setGalleryFiles([]);
    setError(null);
    setSuccess(null);
    setView({ mode: "new" });
  }

  function openEdit(index: number) {
    const item = listings[index]!;
    setDraft({
      ...item,
      detail: normalizeDetailForForm(detailForAdminForm(item, listings)),
    });
    setImageFile(null);
    setGalleryFiles([]);
    setError(null);
    setSuccess(null);
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
      detail: {
        ...normalizedDetail,
        poiLines: (normalizedDetail.poiLines ?? [])
          .map((line) => line.trim())
          .filter(Boolean),
        tags: (normalizedDetail.tags ?? []).map((t) => t.trim()).filter(Boolean),
      },
    };

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
    } = {};
    if (imageFile) uploads.image = { file: imageFile, slug };
    if (galleryFiles.length) uploads.gallery = { files: galleryFiles, slug };

    persist(
      nextListings,
      nextFeatured,
      uploads.image || uploads.gallery ? uploads : undefined,
      () => setView({ mode: "list" }),
    );
  }

  if (view.mode === "edit" || view.mode === "new") {
    const isNew = view.mode === "new";
    const tagsText = textFromLines(draft.detail?.tags);
    const poiLines = draft.detail?.poiLines ?? [];
    const relatedText = textFromLines(draft.detail?.relatedSlugs);
    const stats = draft.detail?.stats ?? [];
    const units = draft.detail?.units ?? [];

    return (
      <div className="page-editor w-full">
        <button
          type="button"
          className="admin-editor-back"
          onClick={() => setView({ mode: "list" })}
        >
          ← Volver al listado
        </button>

        <header className="admin-page-header">
          <h1>{isNew ? "Nueva propiedad" : "Editar propiedad"}</h1>
          <p>
            {isNew
              ? "Completá los datos y guardá para publicar en el sitio."
              : `Editando: ${draft.name || "—"}`}
          </p>
        </header>

        {error ? (
          <p className="admin-alert-error mb-6" role="alert">
            {error}
          </p>
        ) : null}

        <form onSubmit={handleSaveForm} className="flex flex-col gap-8">
          <section>
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

          <section>
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

          <section>
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

          <section>
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

          <section>
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

          <section>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="admin-form-section-label mb-1">
                  Puntos de interés cercanos
                </h2>
                <p className="text-sm text-[var(--admin-text-muted)]">
                  Agregá todos los que quieras; en el sitio se ordenan solos en columnas
                  (2–4 según el ancho de pantalla).
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
                      placeholder="Ej. Puerto Madero"
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

          <section>
            <h2 className="admin-form-section-label">
              Franja corporativa y estadísticas
            </h2>
            <p className="mb-4 text-sm text-[var(--admin-text-muted)]">
              Bloque negro de la ficha: título, párrafo, botón y las cuatro cifras.
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
                    placeholder="134"
                  />
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="admin-form-section-label mb-0">Unidades</h2>
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
                    <div className="mb-3 flex justify-end">
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
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
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

          <section>
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
            </div>
          </section>

          <div className="admin-form-actions">
            <button type="submit" disabled={pending} className="admin-btn-primary">
              {pending ? "Guardando…" : "Guardar"}
            </button>
            <button
              type="button"
              className="admin-btn-secondary"
              onClick={() => setView({ mode: "list" })}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="page-editor w-full">
      <header className="admin-page-header flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1>Propiedades</h1>
          <p>
            Gestioná los edificios: agregá, editá, ocultá o eliminá según sea necesario.
            Aparecen en{" "}
            <a href="/propiedades" target="_blank" rel="noopener noreferrer">
              /propiedades
            </a>{" "}
            y en la home si están destacadas.
          </p>
        </div>
        <button type="button" className="admin-btn-primary shrink-0" onClick={openNew}>
          + Nueva propiedad
        </button>
      </header>

      {error ? (
        <p className="admin-alert-error mb-6" role="alert">
          {error}
        </p>
      ) : null}
      {success ? <p className="admin-alert-success mb-6">{success}</p> : null}

      {listings.length === 0 ? (
        <p className="text-sm text-[var(--admin-text-muted)]">
          Todavía no hay propiedades. Creá la primera con «Nueva propiedad».
        </p>
      ) : (
        <ul className="admin-list">
          {listings.map((item, index) => {
            const status = propertyStatus(item);
            const meta = [
              item.city,
              item.neighborhood,
              item.comingSoon ? null : "Ficha activa",
            ]
              .filter(Boolean)
              .join(" · ");

            return (
              <li key={`${item.slug}-${index}`} className="admin-list-card">
                <div className="admin-list-card__main">
                  <span className="admin-list-card__icon" aria-hidden>
                    🏢
                  </span>
                  <div className="min-w-0">
                    <p className="admin-list-card__title">{item.name}</p>
                    <div className="admin-list-card__meta-row">
                      <span
                        className={`admin-list-card__badge ${status.className}`}
                      >
                        {status.label}
                      </span>
                      {featuredSlugs.includes(item.slug) ? (
                        <span className="text-[0.6875rem] font-medium uppercase tracking-wide text-[var(--admin-orange)]">
                          Destacada en home
                        </span>
                      ) : null}
                      {item.hasOffer ? (
                        <span className="text-[0.6875rem] font-semibold uppercase tracking-wide text-[#f27438]">
                          Oferta
                        </span>
                      ) : null}
                      {item.isPopular ? (
                        <span className="text-[0.6875rem] font-semibold uppercase tracking-wide text-[var(--admin-blue)]">
                          Más solicitada
                        </span>
                      ) : null}
                    </div>
                    <p className="admin-list-card__meta">{meta}</p>
                  </div>
                </div>
                <div className="admin-list-card__actions">
                  <button
                    type="button"
                    className={`admin-visibility-btn ${item.hidden ? "admin-visibility-btn--off" : ""}`}
                    disabled={pending}
                    onClick={() => toggleVisibility(index)}
                    aria-label={item.hidden ? "Mostrar en el sitio" : "Ocultar del sitio"}
                    title={item.hidden ? "Mostrar" : "Ocultar"}
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
    </div>
  );
}
