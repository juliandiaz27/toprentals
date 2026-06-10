import { plainTextFromRichHtml } from "@/lib/richText/sanitize";

export function pageMetadataTitle(
  value: string,
  siteName = "Top Rentals",
): string {
  const plain = plainTextFromRichHtml(value);
  return plain ? `${plain} | ${siteName}` : siteName;
}

export function pageMetadataDescription(value: string): string | undefined {
  const plain = plainTextFromRichHtml(value);
  return plain || undefined;
}
