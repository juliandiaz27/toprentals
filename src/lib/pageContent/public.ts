import { getNested } from "./nested";
import { readPageContent } from "./storage";

export async function pageString(
  slug: string,
  path: string,
  fallback = "",
): Promise<string> {
  const content = await readPageContent(slug);
  const value = getNested(content, path);
  if (value === undefined || value === null) return fallback;
  return String(value);
}
