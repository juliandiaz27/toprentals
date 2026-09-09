/** Enlace de WhatsApp con tracking. El wa.me solo con número abre el chat genérico. */
export const SITE_WHATSAPP_URL = "https://wspk.link/a/HPplAmzS";

const STALE_PHONE = "5491163023094";
const TRACKING_REF = "dCcwkjrU";

function safeDecode(url: string): string {
  try {
    return decodeURIComponent(url);
  } catch {
    return url;
  }
}

/**
 * Si el contenido (p. ej. Vercel Blob) todavía tiene el wa.me viejo,
 * usamos el enlace con mensaje precargado y ref de tracking.
 */
export function resolveSiteWhatsAppUrl(raw: unknown): string {
  const url = String(raw ?? "").trim();
  if (
    !url ||
    url === "#" ||
    url === "https://wa.me" ||
    url === "https://wa.me/"
  ) {
    return SITE_WHATSAPP_URL;
  }
  if (url.includes("wspk.link")) return url;

  const decoded = safeDecode(url);
  const isOldPhoneOnly =
    url.includes(STALE_PHONE) && !decoded.includes(TRACKING_REF);
  if (isOldPhoneOnly) return SITE_WHATSAPP_URL;

  return url;
}
