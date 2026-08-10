import type { ScrollPopupConfig } from "./types";

export function scrollPopupStorageKey(popup: ScrollPopupConfig): string {
  const slug = [
    popup.title,
    popup.description,
    popup.imageUrl,
    popup.highlight,
    popup.ctaLabel,
    popup.titleEn,
    popup.descriptionEn,
    popup.highlightEn,
    popup.ctaLabelEn,
    popup.ctaHref,
    popup.scrollThreshold,
    popup.audience,
    popup.startAt,
    popup.endAt,
  ].join("|");
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash << 5) - hash + slug.charCodeAt(i);
    hash |= 0;
  }
  return `tr-scroll-popup-${Math.abs(hash)}`;
}

function localDateKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function isScrollPopupDismissedToday(storageKey: string): boolean {
  try {
    return localStorage.getItem(`${storageKey}-day`) === localDateKey();
  } catch {
    return false;
  }
}

export function dismissScrollPopupForToday(storageKey: string): void {
  try {
    localStorage.setItem(`${storageKey}-day`, localDateKey());
  } catch {
    /* ignore */
  }
}
