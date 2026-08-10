"use client";

import { useCallback, useState, useTransition } from "react";
import { submitPropertyReview } from "@/app/property-reviews/actions";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import {
  isTurnstileRequired,
  TurnstileField,
} from "@/components/spam/TurnstileField";
import type { PropertyReview } from "@/lib/properties/reviewsTypes";
import { formatReviewDate } from "@/lib/properties/reviewsFormat";

type Props = {
  propertySlug: string;
  propertyName: string;
  reviews: PropertyReview[];
};

function StarRating({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <span className="inline-flex gap-0.5 text-amber-500" aria-label={label}>
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
  const { ui } = useLanguage();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRequired = isTurnstileRequired();

  const onTurnstileToken = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (turnstileRequired && !turnstileToken) {
      setError(ui.reviews.turnstileRequired);
      return;
    }
    const fd = new FormData(e.currentTarget);
    if (turnstileToken) {
      fd.set("cf-turnstile-response", turnstileToken);
    }

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
      <h2 className="text-xl font-bold text-neutral-950">{ui.reviews.title}</h2>
      <p className="mt-2 max-w-xl text-[15px] text-neutral-600">
        {ui.reviews.intro.replace("{name}", propertyName)}
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
                  <StarRating
                    value={review.rating}
                    label={ui.reviews.starsOf5.replace(
                      "{value}",
                      String(review.rating),
                    )}
                  />
                </div>
              ) : null}
              <p className="mt-3 text-[15px] leading-relaxed text-neutral-700">
                {review.body}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-8 text-[14px] text-neutral-500">{ui.reviews.empty}</p>
      )}

      <div className="mt-10 rounded-xl border border-neutral-200 bg-white p-5 sm:p-6">
        <h3 className="text-[17px] font-bold text-neutral-950">
          {ui.reviews.leaveReview}
        </h3>

        {submitted ? (
          <p className="mt-4 text-[15px] text-neutral-700" role="status">
            {ui.reviews.success}
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
              <span className="text-[13px] font-semibold text-neutral-700">
                {ui.reviews.name}
              </span>
              <input
                name="authorName"
                required
                minLength={2}
                maxLength={80}
                className="rounded-lg border border-neutral-200 px-3 py-2.5 text-[15px] text-neutral-950 outline-none focus:border-neutral-400"
                placeholder={ui.reviews.namePlaceholder}
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[13px] font-semibold text-neutral-700">
                {ui.reviews.ratingOptional}
              </span>
              <select
                name="rating"
                className="max-w-[200px] rounded-lg border border-neutral-200 px-3 py-2.5 text-[15px] text-neutral-950 outline-none focus:border-neutral-400"
                defaultValue=""
              >
                <option value="">{ui.reviews.noRating}</option>
                <option value="5">{ui.reviews.rating5}</option>
                <option value="4">{ui.reviews.rating4}</option>
                <option value="3">{ui.reviews.rating3}</option>
                <option value="2">{ui.reviews.rating2}</option>
                <option value="1">{ui.reviews.rating1}</option>
              </select>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[13px] font-semibold text-neutral-700">
                {ui.reviews.comment}
              </span>
              <textarea
                name="body"
                required
                minLength={10}
                maxLength={2000}
                rows={4}
                className="resize-y rounded-lg border border-neutral-200 px-3 py-2.5 text-[15px] text-neutral-950 outline-none focus:border-neutral-400"
                placeholder={ui.reviews.commentPlaceholder}
              />
            </label>

            <TurnstileField onTokenChange={onTurnstileToken} />

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
              {pending ? ui.common.sending : ui.reviews.submit}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
