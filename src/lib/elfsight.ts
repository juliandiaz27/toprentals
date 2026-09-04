/**
 * Extrae el App ID de un snippet Elfsight, de una clase `elfsight-app-…`
 * o de un UUID suelto. Devuelve "" si no hay match válido.
 */
export function parseElfsightAppId(raw: string): string {
  const input = String(raw ?? "").trim();
  if (!input) return "";

  const fromClass = input.match(
    /elfsight-app-([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i,
  );
  if (fromClass?.[1]) return fromClass[1].toLowerCase();

  const uuidOnly = input.match(
    /^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i,
  );
  if (uuidOnly?.[1]) return uuidOnly[1].toLowerCase();

  return "";
}

/** Snippet listo para pegar de nuevo (útil en el panel al reabrir). */
export function formatElfsightEmbedSnippet(appId: string): string {
  const id = parseElfsightAppId(appId);
  if (!id) return "";
  return [
    "<!-- Elfsight Google Reviews -->",
    '<script src="https://elfsightcdn.com/platform.js" async></script>',
    `<div class="elfsight-app-${id}" data-elfsight-app-lazy></div>`,
  ].join("\n");
}

export const ELFSIGHT_PLATFORM_SRC = "https://elfsightcdn.com/platform.js";
