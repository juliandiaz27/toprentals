"use client";

import { useCallback, useEffect, useState } from "react";
import { PropertyHighlightBadges } from "@/components/properties/PropertyHighlightBadges";

type Props = {
  images: string[];
  hasOffer?: boolean;
  isPopular?: boolean;
};

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={direction === "left" ? "" : "rotate-180"}
    >
      <path
        d="M14 6l-6 6 6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PropertyDetailGallery({
  images,
  hasOffer,
  isPopular,
}: Props) {
  const [index, setIndex] = useState(0);
  const count = images.length;
  const hasMultiple = count > 1;

  const go = useCallback(
    (delta: number) => {
      if (!hasMultiple) return;
      setIndex((i) => (i + delta + count) % count);
    },
    [count, hasMultiple],
  );

  useEffect(() => {
    setIndex(0);
  }, [images]);

  useEffect(() => {
    if (!hasMultiple) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, hasMultiple]);

  if (count === 0) {
    return (
      <div className="mt-10 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="min-h-[320px] rounded-2xl bg-neutral-200 lg:min-h-[480px]" />
        <div className="flex min-h-[280px] flex-col gap-4 lg:min-h-[480px]">
          <div className="min-h-[200px] flex-1 rounded-2xl bg-neutral-200 lg:min-h-0" />
          <div className="min-h-[200px] flex-1 rounded-2xl bg-neutral-200 lg:min-h-0" />
        </div>
      </div>
    );
  }

  const sideImages = [
    images[1] ?? images[0],
    images[2] ?? images[(index + 1) % count] ?? images[0],
  ];

  return (
    <div
      className="mt-10 grid gap-4 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch"
      aria-roledescription="carousel"
      aria-label="Galería del edificio"
    >
      <div className="group relative min-h-[300px] overflow-hidden rounded-2xl bg-neutral-200 sm:min-h-[360px] lg:min-h-[480px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={images[index]}
          src={images[index]}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
        />

        <div className="absolute left-4 top-4 z-10">
          <PropertyHighlightBadges
            hasOffer={hasOffer}
            isPopular={isPopular}
          />
        </div>

        {hasMultiple ? (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-neutral-900 shadow-[0_2px_12px_rgba(0,0,0,0.12)] transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 sm:opacity-90 lg:opacity-0 lg:group-hover:opacity-100"
              aria-label="Imagen anterior"
            >
              <ChevronIcon direction="left" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-neutral-900 shadow-[0_2px_12px_rgba(0,0,0,0.12)] transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 sm:opacity-90 lg:opacity-0 lg:group-hover:opacity-100"
              aria-label="Imagen siguiente"
            >
              <ChevronIcon direction="right" />
            </button>
            <div
              className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/25 px-2.5 py-2 backdrop-blur-sm"
              role="tablist"
              aria-label="Miniaturas"
            >
              {images.map((src, i) => (
                <button
                  key={`${src}-${i}`}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Imagen ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === index
                      ? "w-6 bg-white"
                      : "w-2 bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>

      <div className="flex min-h-[280px] flex-col gap-4 lg:min-h-[480px]">
        {sideImages.map((src, i) => (
          <div
            key={`side-${i}`}
            className="relative min-h-[200px] flex-1 overflow-hidden rounded-2xl bg-neutral-200 lg:min-h-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
