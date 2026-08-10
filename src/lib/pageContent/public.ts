import { getNested } from "./nested";
import { readPageContent } from "./storage";
import { getSiteLanguage } from "@/lib/i18nServer";

/** Contenido CMS en el idioma activo del visitante. */
export async function readLocalizedPageContent(slug: string) {
  const language = await getSiteLanguage();
  return readPageContent(slug, language);
}

export async function pageString(
  slug: string,
  path: string,
  fallback = "",
): Promise<string> {
  const content = await readLocalizedPageContent(slug);
  const value = getNested(content, path);
  if (value === undefined || value === null) return fallback;
  return String(value);
}
