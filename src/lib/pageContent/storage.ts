import { dataFilePath } from "@/lib/repoRoot";
import { readJsonFile, writeJsonFile } from "@/lib/fsJson";
import { buildDefaultsFromFields } from "./nested";
import { getPageDefinition } from "./schemas";
import type { PageContent } from "./types";

function filePath(slug: string): string {
  return dataFilePath(`${slug}-content.json`);
}

export async function readPageContent(slug: string): Promise<PageContent> {
  const def = getPageDefinition(slug);
  if (!def) throw new Error(`Página desconocida: ${slug}`);
  const defaults = buildDefaultsFromFields(def.fields);
  return readJsonFile(filePath(slug), defaults);
}

export async function writePageContent(
  slug: string,
  content: PageContent,
): Promise<void> {
  await writeJsonFile(filePath(slug), content);
}
