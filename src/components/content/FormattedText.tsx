import {
  looksLikeHtml,
  plainTextFromRichHtml,
  sanitizeRichHtml,
} from "@/lib/richText/sanitize";

type Props = {
  value: string;
  className?: string;
  /** Si el contenido va dentro de un párrafo o heading (evita <p> anidados). */
  as?: "div" | "span" | "inline";
};

/** Quita un único <p> envolvente para títulos y chips inline. */
function htmlForInlineDisplay(html: string): string {
  const sanitized = sanitizeRichHtml(html).trim();
  const unwrapped = sanitized.replace(/^<p>([\s\S]*?)<\/p>$/i, "$1").trim();
  return unwrapped || sanitized;
}

export function FormattedText({ value, className = "", as = "div" }: Props) {
  if (!value) return null;

  if (!looksLikeHtml(value)) {
    const Tag = as === "div" ? "div" : "span";
    return (
      <Tag className={`whitespace-pre-line ${className}`.trim()}>{value}</Tag>
    );
  }

  if (as === "inline") {
    const html = htmlForInlineDisplay(value);
    if (!/<[a-z]/i.test(html)) {
      return (
        <span className={className.trim()}>{plainTextFromRichHtml(value)}</span>
      );
    }
    return (
      <span
        className={`formatted-text formatted-text--inline ${className}`.trim()}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  const html = sanitizeRichHtml(value);
  const Tag = as === "span" ? "span" : "div";
  return (
    <Tag
      className={`formatted-text ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
