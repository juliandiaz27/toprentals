import { cache } from "react";
import { dataFilePath } from "@/lib/repoRoot";
import { readJsonFile, writeJsonFile } from "@/lib/fsJson";
import {
  buildDefaultsFromFields,
  deleteNested,
  getNested,
  setNested,
} from "./nested";
import { resolveStorageSlug } from "./adminNav";
import { getPageDefinition } from "./schemas";
import type { PageContent } from "./types";
import {
  DEFAULT_SITE_LANGUAGE,
  type SiteLanguage,
} from "@/lib/i18n";
import { deepMerge } from "@/lib/i18n/deepMerge";

function filePath(slug: string): string {
  return dataFilePath(`${resolveStorageSlug(slug)}-content.json`);
}

function enFilePath(slug: string): string {
  return dataFilePath(`${resolveStorageSlug(slug)}-content.en.json`);
}

function contentValuesEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

async function readPageContentUncached(
  slug: string,
  language: SiteLanguage = DEFAULT_SITE_LANGUAGE,
): Promise<PageContent> {
  const def = getPageDefinition(slug);
  if (!def) throw new Error(`Página desconocida: ${slug}`);

  const stored = await readJsonFile(filePath(slug), {});
  const defaults = buildDefaultsFromFields(def.fields);
  let content = { ...stored } as PageContent;

  for (const field of def.fields) {
    const current = getNested(content, field.key);
    if (current === undefined || current === null || current === "") {
      const fallback = getNested(defaults, field.key);
      if (fallback !== undefined && fallback !== "") {
        setNested(content, field.key, fallback);
      }
    }
  }

  if (language === "en") {
    const enOverlay = await readJsonFile<Record<string, unknown>>(
      enFilePath(slug),
      {},
    );
    if (Object.keys(enOverlay).length > 0) {
      content = deepMerge(content as Record<string, unknown>, enOverlay) as PageContent;
    }
  }

  return content;
}

/** Una lectura por request (layout + páginas que comparten slug + idioma). */
export const readPageContent = cache(readPageContentUncached);

/**
 * Persiste contenido de página.
 * - `es` → `*-content.json` (comportamiento histórico).
 * - `en` → solo el overlay `*-content.en.json` (no toca el español).
 *
 * Para EN, `content` debe ser el draft del formulario (valores finales por campo).
 * Solo se guardan claves distintas del español; las iguales se eliminan del overlay.
 */
export async function writePageContent(
  slug: string,
  content: PageContent,
  language: SiteLanguage = DEFAULT_SITE_LANGUAGE,
): Promise<void> {
  const def = getPageDefinition(slug);
  if (!def) throw new Error(`Página desconocida: ${slug}`);

  if (language === "en") {
    await writeEnglishOverlay(slug, content);
    return;
  }

  const fileSlug = resolveStorageSlug(slug);
  const mergeIntoExisting = fileSlug !== slug || slug === "home";
  const full = mergeIntoExisting
    ? { ...(await readJsonFile(filePath(slug), {})) }
    : { ...content };

  if (slug === "home-header") {
    // Editor dedicado: el schema no declara fields; se persiste el bloque header.
    if (content.header !== undefined) {
      full.header = content.header;
    }
  } else {
    for (const field of def.fields) {
      const value = getNested(content, field.key);
      if (value !== undefined) {
        setNested(full, field.key, value);
      }
    }
  }

  await writeJsonFile(filePath(slug), full);
}

const HEADER_OVERLAY_KEYS = [
  "logoSrc",
  "logoText",
  "ctaLabel",
  "nav",
] as const;

async function writeEnglishOverlay(
  slug: string,
  draft: PageContent,
): Promise<void> {
  const def = getPageDefinition(slug);
  if (!def) throw new Error(`Página desconocida: ${slug}`);

  const spanish = await readPageContentUncached(slug, "es");
  const full = {
    ...(await readJsonFile<Record<string, unknown>>(enFilePath(slug), {})),
  };

  if (slug === "home-header") {
    const draftHeader = (draft.header ?? {}) as Record<string, unknown>;
    const spanishHeader = (spanish.header ?? {}) as Record<string, unknown>;
    const nextHeader = {
      ...((full.header as Record<string, unknown> | undefined) ?? {}),
    };

    for (const key of HEADER_OVERLAY_KEYS) {
      const draftVal = draftHeader[key];
      if (draftVal === undefined) continue;
      if (contentValuesEqual(draftVal, spanishHeader[key])) {
        delete nextHeader[key];
      } else {
        nextHeader[key] = draftVal;
      }
    }

    if (Object.keys(nextHeader).length === 0) {
      delete full.header;
    } else {
      full.header = nextHeader;
    }

    await writeJsonFile(enFilePath(slug), full);
    return;
  }

  for (const field of def.fields) {
    const draftVal = getNested(draft, field.key);
    if (draftVal === undefined) continue;
    const esVal = getNested(spanish, field.key);
    if (contentValuesEqual(draftVal, esVal)) {
      deleteNested(full, field.key);
    } else {
      setNested(full, field.key, draftVal);
    }
  }

  await writeJsonFile(enFilePath(slug), full);
}
