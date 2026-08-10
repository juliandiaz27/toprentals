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

/** Quita una clave anidada y limpia objetos padre vacíos. */
export function deleteNested(obj: Record<string, unknown>, path: string): void {
  const parts = path.split(".");
  const stack: { parent: Record<string, unknown>; key: string }[] = [];
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i]!;
    const next = current[part];
    if (next == null || typeof next !== "object" || Array.isArray(next)) {
      return;
    }
    stack.push({ parent: current, key: part });
    current = next as Record<string, unknown>;
  }
  delete current[parts[parts.length - 1]!];
  for (let i = stack.length - 1; i >= 0; i--) {
    const { parent, key } = stack[i]!;
    const child = parent[key];
    if (
      child &&
      typeof child === "object" &&
      !Array.isArray(child) &&
      Object.keys(child as object).length === 0
    ) {
      delete parent[key];
    } else {
      break;
    }
  }
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
