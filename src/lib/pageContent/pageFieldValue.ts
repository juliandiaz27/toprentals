import type { PageField } from "./types";
import {
  isAllowedInternalHref,
  isExternalUrlFieldKey,
  normalizeInternalHref,
  resolveRoutePickerValue,
} from "./siteRoutes";
import { sanitizeCorporateHref } from "./corporateCtas";

export function resolveAdminFieldValue(
  field: PageField,
  raw: string,
  pageSlug?: string,
): string {
  if (field.lockedHref != null && field.lockedHref !== "") {
    return field.lockedHref;
  }

  const trimmed = raw.trim();
  const fallback = field.fallback ?? "";

  if (field.routePreset) {
    return resolveRoutePickerValue(trimmed, field.routePreset, fallback);
  }

  if (field.type === "url" && isExternalUrlFieldKey(field.key)) {
    return trimmed || fallback;
  }

  if (field.type === "url") {
    const normalized = normalizeInternalHref(trimmed);
    if (pageSlug === "corporate" && /cta.*Href$/i.test(field.key)) {
      return sanitizeCorporateHref(normalized || fallback);
    }
    if (isAllowedInternalHref(normalized, "menu")) return normalized;
    return resolveRoutePickerValue(fallback, "menu", "/");
  }

  return trimmed;
}

export function fieldUsesRoutePicker(field: PageField): boolean {
  if (field.lockedHref) return false;
  if (field.routePreset) return true;
  return field.type === "url" && !isExternalUrlFieldKey(field.key);
}

export function fieldIsLockedRoute(field: PageField): boolean {
  return Boolean(field.lockedHref);
}
