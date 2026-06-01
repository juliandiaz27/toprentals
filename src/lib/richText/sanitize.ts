import DOMPurify from "isomorphic-dompurify";

const PURIFY_OPTIONS = {
  ALLOWED_TAGS: ["p", "br", "strong", "b", "em", "i", "u", "ul", "ol", "li", "a"],
  ALLOWED_ATTR: ["href", "target", "rel"],
};

export function sanitizeRichHtml(html: string): string {
  return DOMPurify.sanitize(html, PURIFY_OPTIONS);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Convierte texto plano (con \\n) al HTML que espera el editor. */
export function plainToEditorHtml(value: string): string {
  if (!value) return "";
  if (/<[a-z][\s\S]*>/i.test(value)) return value;

  const blocks = value.split(/\n{2,}/);
  return blocks
    .map((block) => {
      const inner = escapeHtml(block).replace(/\n/g, "<br>");
      return `<p>${inner || "<br>"}</p>`;
    })
    .join("");
}

export function looksLikeHtml(value: string): boolean {
  return /<[a-z][\s\S]*>/i.test(value);
}

/** Vacía párrafos vacíos del editor antes de guardar. */
export function normalizeStoredRichHtml(html: string): string {
  const trimmed = html.trim();
  if (!trimmed) return "";
  if (
    trimmed === "<p></p>" ||
    trimmed === "<p><br></p>" ||
    trimmed === "<p><br/></p>"
  ) {
    return "";
  }
  return trimmed;
}
