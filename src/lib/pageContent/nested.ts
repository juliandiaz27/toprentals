export function getNested(obj: Record<string, unknown>, path: string): unknown {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

export function setNested(
  obj: Record<string, unknown>,
  path: string,
  value: unknown,
): void {
  const parts = path.split(".");
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (
      current[part] == null ||
      typeof current[part] !== "object" ||
      Array.isArray(current[part])
    ) {
      current[part] = {};
    }
    current = current[part] as Record<string, unknown>;
  }
  current[parts[parts.length - 1]] = value;
}

import type { PageContent } from "./types";

export function buildDefaultsFromFields(
  fields: { key: string; type: string; fallback?: string }[],
): PageContent {
  const out: PageContent = {};
  for (const f of fields) {
    let val: unknown = f.fallback ?? "";
    if (f.type === "boolean") val = f.fallback === "true";
    if (f.type === "image" && !f.fallback) {
      val = "/images/placeholders/home-hero.svg";
    }
    setNested(out, f.key, val);
  }
  return out;
}
