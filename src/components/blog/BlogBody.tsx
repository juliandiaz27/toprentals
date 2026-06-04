import {
  looksLikeHtml,
  sanitizeBlogHtml,
} from "@/lib/richText/sanitize";

type Props = {
  html: string;
  className?: string;
};

export function BlogBody({ html, className = "" }: Props) {
  if (!html) return null;

  if (!looksLikeHtml(html)) {
    return (
      <div className={`blog-body whitespace-pre-line ${className}`.trim()}>
        {html}
      </div>
    );
  }

  const safe = sanitizeBlogHtml(html);
  return (
    <div
      className={`blog-body formatted-text ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}
