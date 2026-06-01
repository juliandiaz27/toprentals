import {
  looksLikeHtml,
  sanitizeRichHtml,
} from "@/lib/richText/sanitize";

type Props = {
  value: string;
  className?: string;
  /** Si el contenido va dentro de un párrafo (evita <p> dentro de <p>). */
  as?: "div" | "span" | "inline";
};

export function FormattedText({ value, className = "", as = "div" }: Props) {
  if (!value) return null;

  if (!looksLikeHtml(value)) {
    const Tag = as === "div" ? "div" : "span";
    return (
      <Tag className={`whitespace-pre-line ${className}`.trim()}>{value}</Tag>
    );
  }

  const html = sanitizeRichHtml(value);
  if (as === "inline") {
    return (
      <span
        className={`formatted-text formatted-text--inline ${className}`.trim()}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  const Tag = as === "span" ? "span" : "div";
  return (
    <Tag
      className={`formatted-text ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
