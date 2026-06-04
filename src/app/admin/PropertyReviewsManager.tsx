"use client";

import { useMemo, useState, useTransition } from "react";
import type { PropertyListingStored } from "@/lib/properties/catalogTypes";
import type { PropertyReviewStored } from "@/lib/properties/reviewsTypes";
import { formatReviewDate } from "@/lib/properties/reviewsFormat";
import { savePropertyReviews } from "./propertyReviewsActions";

type Props = {
  initialReviews: PropertyReviewStored[];
  properties: PropertyListingStored[];
};

export function PropertyReviewsManager({
  initialReviews,
  properties,
}: Props) {
  const [reviews, setReviews] = useState(initialReviews);
  const [filterSlug, setFilterSlug] = useState<string>("all");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const propertyNames = useMemo(() => {
    const map = new Map(properties.map((p) => [p.slug, p.name]));
    return map;
  }, [properties]);

  const filtered = useMemo(() => {
    const list = [...reviews].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    if (filterSlug === "all") return list;
    return list.filter((r) => r.propertySlug === filterSlug);
  }, [reviews, filterSlug]);

  const pendingCount = reviews.filter((r) => !r.visible).length;

  function updateReview(id: string, patch: Partial<PropertyReviewStored>) {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    );
  }

  function removeReview(id: string) {
    if (!window.confirm("¿Eliminar este comentario?")) return;
    setReviews((prev) => prev.filter((r) => r.id !== id));
  }

  function handleSave() {
    setError(null);
    setSuccess(null);
    const fd = new FormData();
    fd.set("reviews", JSON.stringify(reviews));

    startTransition(async () => {
      const res = await savePropertyReviews(fd);
      if (!res.ok) {
        setError(res.error ?? "Error al guardar");
        return;
      }
      setSuccess("Comentarios guardados.");
    });
  }

  return (
    <div>
      <header className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Comentarios de propiedades</h1>
          <p className="admin-page-desc">
            Revisá los comentarios enviados por usuarios. Activá «Mostrar en el sitio»
            para publicarlos en la ficha de cada edificio.
          </p>
        </div>
        <button
          type="button"
          className="admin-btn-primary"
          disabled={pending}
          onClick={handleSave}
        >
          {pending ? "Guardando…" : "Guardar cambios"}
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

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <label className="flex flex-col gap-1">
          <span className="admin-field-label">Filtrar por propiedad</span>
          <select
            value={filterSlug}
            onChange={(e) => setFilterSlug(e.target.value)}
            className="admin-input min-w-[220px]"
          >
            <option value="all">Todas ({reviews.length})</option>
            {properties.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        {pendingCount > 0 ? (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-900">
            {pendingCount} sin publicar
          </span>
        ) : null}
      </div>

      {filtered.length === 0 ? (
        <p className="text-[var(--admin-text-dim)]">
          No hay comentarios{filterSlug !== "all" ? " para esta propiedad" : ""}.
        </p>
      ) : (
        <ul className="flex flex-col gap-5">
          {filtered.map((review) => (
            <li
              key={review.id}
              className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5"
            >
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-[var(--admin-text)]">
                    {propertyNames.get(review.propertySlug) ?? review.propertySlug}
                  </p>
                  <p className="text-xs text-[var(--admin-text-dim)]">
                    {formatReviewDate(review.createdAt)} · /propiedades/
                    {review.propertySlug}
                  </p>
                </div>
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input
                    type="checkbox"
                    checked={review.visible}
                    onChange={(e) =>
                      updateReview(review.id, { visible: e.target.checked })
                    }
                  />
                  Mostrar en el sitio
                </label>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <label className="flex flex-col gap-1">
                  <span className="admin-field-label">Nombre</span>
                  <input
                    className="admin-input"
                    value={review.authorName}
                    onChange={(e) =>
                      updateReview(review.id, { authorName: e.target.value })
                    }
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="admin-field-label">Valoración (1–5)</span>
                  <select
                    className="admin-input"
                    value={review.rating ?? ""}
                    onChange={(e) => {
                      const v = e.target.value;
                      updateReview(review.id, {
                        rating: v ? Number(v) : undefined,
                      });
                    }}
                  >
                    <option value="">—</option>
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="mt-4 flex flex-col gap-1">
                <span className="admin-field-label">Comentario</span>
                <textarea
                  className="admin-input min-h-[100px]"
                  value={review.body}
                  onChange={(e) =>
                    updateReview(review.id, { body: e.target.value })
                  }
                />
              </label>

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  className="text-sm text-red-600 hover:underline"
                  onClick={() => removeReview(review.id)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
