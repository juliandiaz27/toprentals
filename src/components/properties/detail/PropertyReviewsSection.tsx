"use client";

import { useState, useTransition } from "react";
import { submitPropertyReview } from "@/app/property-reviews/actions";
import type { PropertyReview } from "@/lib/properties/reviewsTypes";
import { formatReviewDate } from "@/lib/properties/reviewsFormat";

type Props = {
  propertySlug: string;
  propertyName: string;
  reviews: PropertyReview[];
};

function StarRating({ value }: { value: number }) {
  return (
    <span className="inline-flex gap-0.5 text-amber-500" aria-label={`${value} de 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= value ? "opacity-100" : "opacity-25"}>
          ★
        </span>
      ))}
    </span>
  );
}

export function PropertyReviewsSection({
  propertySlug,
  propertyName,
  reviews,
}: Props) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await submitPropertyReview(fd);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setSubmitted(true);
      e.currentTarget.reset();
    });
  }

  return (
    <section data-reveal className="mt-16 border-t border-neutral-200 pt-16">
      <h2 className="text-xl font-bold text-neutral-950">Comentarios</h2>
      <p className="mt-2 max-w-xl text-[15px] text-neutral-600">
        Contanos tu experiencia en {propertyName}. Los comentarios se publican tras
        una revisión del equipo.
      </p>

      {reviews.length > 0 ? (
        <ul className="mt-10 flex flex-col gap-6">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="rounded-xl border border-neutral-200 bg-[#FAFAFA] px-5 py-5 sm:px-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-[15px] font-bold text-neutral-950">
                  {review.authorName}
                </p>
                <time
                  dateTime={review.createdAt}
                  className="text-[13px] text-neutral-500"
                >
                  {formatReviewDate(review.createdAt)}
                </time>
              </div>
              {review.rating ? (
                <div className="mt-2">
                  <StarRating value={review.rating} />
                </div>
              ) : null}
              <p className="mt-3 text-[15px] leading-relaxed text-neutral-700">
                {review.body}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-8 text-[14px] text-neutral-500">
          Todavía no hay comentarios publicados.
        </p>
      )}

      <div className="mt-10 rounded-xl border border-neutral-200 bg-white p-5 sm:p-6">
        <h3 className="text-[17px] font-bold text-neutral-950">Dejá tu comentario</h3>

        {submitted ? (
          <p className="mt-4 text-[15px] text-neutral-700" role="status">
            Gracias. Tu comentario fue recibido y lo revisaremos antes de publicarlo.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
            <input type="hidden" name="propertySlug" value={propertySlug} />
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              className="absolute h-0 w-0 opacity-0"
              aria-hidden
            />

            <label className="flex flex-col gap-1.5">
              <span className="text-[13px] font-semibold text-neutral-700">Nombre</span>
              <input
                name="authorName"
                required
                minLength={2}
                maxLength={80}
                className="rounded-lg border border-neutral-200 px-3 py-2.5 text-[15px] text-neutral-950 outline-none focus:border-neutral-400"
                placeholder="Tu nombre"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[13px] font-semibold text-neutral-700">
                Valoración (opcional)
              </span>
              <select
                name="rating"
                className="max-w-[200px] rounded-lg border border-neutral-200 px-3 py-2.5 text-[15px] text-neutral-950 outline-none focus:border-neutral-400"
                defaultValue=""
              >
                <option value="">Sin valoración</option>
                <option value="5">5 — Excelente</option>
                <option value="4">4 — Muy bueno</option>
                <option value="3">3 — Bueno</option>
                <option value="2">2 — Regular</option>
                <option value="1">1 — Malo</option>
              </select>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[13px] font-semibold text-neutral-700">
                Comentario
              </span>
              <textarea
                name="body"
                required
                minLength={10}
                maxLength={2000}
                rows={4}
                className="resize-y rounded-lg border border-neutral-200 px-3 py-2.5 text-[15px] text-neutral-950 outline-none focus:border-neutral-400"
                placeholder="¿Qué te pareció el edificio, la ubicación, el servicio?"
              />
            </label>

            {error ? (
              <p className="text-[14px] text-red-600" role="alert">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={pending}
              className="inline-flex h-11 w-full max-w-xs items-center justify-center rounded-lg bg-btn text-[14px] font-medium text-white hover:bg-btn-hover disabled:opacity-60 sm:w-auto sm:px-8"
            >
              {pending ? "Enviando…" : "Enviar comentario"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
