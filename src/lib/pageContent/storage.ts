import { cache } from "react";
import { dataFilePath } from "@/lib/repoRoot";
import { readJsonFile, writeJsonFile } from "@/lib/fsJson";
import { buildDefaultsFromFields, getNested, setNested } from "./nested";
import { resolveStorageSlug } from "./adminNav";
import { getPageDefinition } from "./schemas";
import type { PageContent } from "./types";

function filePath(slug: string): string {
  return dataFilePath(`${resolveStorageSlug(slug)}-content.json`);
}

async function readPageContentUncached(slug: string): Promise<PageContent> {
  const def = getPageDefinition(slug);
  if (!def) throw new Error(`Página desconocida: ${slug}`);

  const stored = await readJsonFile(filePath(slug), {});
  const defaults = buildDefaultsFromFields(def.fields);
  const content = { ...stored };

  for (const field of def.fields) {
    const current = getNested(content, field.key);
    if (current === undefined || current === null || current === "") {
      const fallback = getNested(defaults, field.key);
      if (fallback !== undefined && fallback !== "") {
        setNested(content, field.key, fallback);
      }
    }
  }

  return content;
}

/** Una lectura por request (layout + páginas que comparten el mismo slug). */
export const readPageContent = cache(readPageContentUncached);

export async function writePageContent(
  slug: string,
  content: PageContent,
): Promise<void> {
  const def = getPageDefinition(slug);
  if (!def) throw new Error(`Página desconocida: ${slug}`);

  const fileSlug = resolveStorageSlug(slug);
  const mergeIntoExisting = fileSlug !== slug || slug === "home";
  const full = mergeIntoExisting
    ? { ...(await readJsonFile(filePath(slug), {})) }
    : { ...content };

  for (const field of def.fields) {
    const value = getNested(content, field.key);
    if (value !== undefined) {
      setNested(full, field.key, value);
    }
  }

  await writeJsonFile(filePath(slug), full);
}
