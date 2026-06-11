"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FormattedText } from "@/components/content/FormattedText";
import {
  dismissScrollPopupForToday,
  isScrollPopupDismissedToday,
} from "@/lib/marketing/scrollPopupStorage";
import type { ScrollPopupConfig } from "@/lib/marketing/types";

const DEFAULT_IMAGE = "/images/properties/placeholder-lobby.png";

const pillButtonClass =
  "inline-flex h-11 shrink-0 items-center justify-center whitespace-nowrap rounded-full px-5 text-[13px] font-semibold transition sm:h-12 sm:px-6 sm:text-[14px]";

type Props = {
  config: ScrollPopupConfig;
  storageKey: string;
};

export function SiteScrollPopup({ config, storageKey }: Props) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [triggered, setTriggered] = useState(false);

  const imageSrc = config.imageUrl.trim() || DEFAULT_IMAGE;

  useLayoutEffect(() => {
    setMounted(true);
    if (isScrollPopupDismissedToday(storageKey)) {
      setTriggered(true);
    }
  }, [storageKey]);

  useEffect(() => {
    if (triggered) return;

    const threshold = Math.max(0, config.scrollThreshold);

    function onScroll() {
      if (window.scrollY >= threshold) {
        setTriggered(true);
        setOpen(true);
      }
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [config.scrollThreshold, triggered]);

  const dismiss = useCallback(() => {
    setOpen(false);
    dismissScrollPopupForToday(storageKey);
  }, [storageKey]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") dismiss();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, dismiss]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[140] flex items-end justify-center p-4 sm:items-center sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="scroll-popup-title"
    >
      <button
        type="button"
        aria-label="Cerrar"
        className="absolute inset-0 bg-neutral-950/45 backdrop-blur-[3px]"
        onClick={dismiss}
      />

      <article className="relative z-[1] w-full max-w-[min(100%,760px)] overflow-hidden rounded-[24px] bg-white shadow-[0_24px_64px_rgba(15,23,42,0.16)] ring-1 ring-black/[0.04] sm:rounded-[28px]">
        <button
          type="button"
          onClick={dismiss}
          className="absolute right-3 top-3 z-[2] flex h-9 w-9 items-center justify-center rounded-full text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-800 sm:right-4 sm:top-4"
          aria-label="Cerrar popup"
        >
          <span className="text-2xl leading-none" aria-hidden>
            ×
          </span>
        </button>

        <div className="flex flex-col sm:flex-row">
          <div className="relative min-h-[200px] shrink-0 sm:min-h-0 sm:w-[46%] lg:w-[48%]">
            <div className="relative aspect-[4/3] h-full min-h-[200px] sm:aspect-auto sm:min-h-[280px] lg:min-h-[300px]">
              <Image
                src={imageSrc}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 360px"
                priority
              />
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col justify-center px-5 py-6 sm:px-7 sm:py-8 lg:px-9 lg:py-9">
            <h2
              id="scroll-popup-title"
              className="pr-8 text-[20px] font-semibold leading-snug tracking-[-0.02em] text-neutral-950 sm:text-[22px] lg:text-[24px]"
            >
              <FormattedText value={config.title} as="inline" />
            </h2>

            {config.description ? (
              <p className="mt-3 text-[14px] leading-[1.65] text-neutral-500 sm:text-[15px]">
                <FormattedText value={config.description} as="inline" />
              </p>
            ) : null}

            {config.highlight ? (
              <p className="mt-3 text-[13px] font-medium text-neutral-800 sm:text-[14px]">
                <FormattedText value={config.highlight} as="inline" />
              </p>
            ) : null}

            <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-7">
              <button
                type="button"
                onClick={dismiss}
                className={`${pillButtonClass} border border-neutral-300 bg-white text-neutral-900 shadow-[0_8px_20px_rgba(15,23,42,0.08)] hover:border-neutral-400 hover:bg-neutral-50`}
              >
                Ahora no
              </button>
              <Link
                href={config.ctaHref}
                onClick={dismiss}
                className={`${pillButtonClass} bg-btn text-white shadow-[0_12px_32px_rgba(18,18,18,0.28)] hover:bg-btn-hover hover:shadow-[0_14px_36px_rgba(18,18,18,0.34)]`}
              >
                {config.ctaLabel}
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>,
    document.body,
  );
}
