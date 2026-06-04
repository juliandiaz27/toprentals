/** Convierte array ↔ texto multilínea para el panel. */
export function linesFromText(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function textFromLines(lines: string[] | undefined): string {
  if (!lines?.length) return "";
  return lines.join("\n");
}
