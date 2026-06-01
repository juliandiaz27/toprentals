import type { PageField } from "./types";

/** Campos que usan editor enriquecido en el panel (no URLs, labels cortos, etc.). */
export function shouldUseRichEditor(field: PageField): boolean {
  if (field.type === "rich" || field.type === "textarea") return true;
  if (field.type !== "text") return false;

  const key = field.key.toLowerCase();
  if (
    /\.(href|url|slug|brand|copyright|siteurl|logotext|ctalabel|invlabel|devlabel|link\d+label|bullet\d+)$/.test(
      key,
    )
  ) {
    return false;
  }

  return /(title|description|subtitle|body|intro|content|tagline|text|quote|mission|vision|meta)/.test(
    key,
  );
}
