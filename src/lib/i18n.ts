/** Idioma del sitio. Persistido en cookie; `?lang=` puede forzarlo puntualmente. */
export type SiteLanguage = "es" | "en";

export const DEFAULT_SITE_LANGUAGE: SiteLanguage = "es";

/** Cookie donde se guarda el idioma elegido en el switcher ES | EN. */
export const SITE_LANGUAGE_COOKIE = "site-lang";

/** 1 año, en segundos. */
export const SITE_LANGUAGE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/** Normaliza cualquier valor (`?lang`, cookie, etc.) a "es" | "en". */
export function normalizeSiteLanguage(value: unknown): SiteLanguage {
  const raw = Array.isArray(value) ? value[0] : value;
  const str = String(raw ?? "").trim().toLowerCase();
  return str.startsWith("en") ? "en" : DEFAULT_SITE_LANGUAGE;
}

/** Lee el idioma desde los searchParams de una página (`?lang=en`). */
export function siteLanguageFromSearchParams(
  searchParams: Record<string, string | string[] | undefined> | undefined,
): SiteLanguage {
  return normalizeSiteLanguage(searchParams?.lang);
}
