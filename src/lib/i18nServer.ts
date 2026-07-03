import { cookies } from "next/headers";
import {
  normalizeSiteLanguage,
  SITE_LANGUAGE_COOKIE,
  type SiteLanguage,
} from "./i18n";

/**
 * Idioma del sitio resuelto en el servidor.
 * Prioridad: `override` (ej. `?lang=`) → cookie → español por defecto.
 */
export async function getSiteLanguage(override?: unknown): Promise<SiteLanguage> {
  const overrideRaw = Array.isArray(override) ? override[0] : override;
  if (overrideRaw != null && String(overrideRaw).trim() !== "") {
    return normalizeSiteLanguage(overrideRaw);
  }
  const store = await cookies();
  return normalizeSiteLanguage(store.get(SITE_LANGUAGE_COOKIE)?.value);
}
