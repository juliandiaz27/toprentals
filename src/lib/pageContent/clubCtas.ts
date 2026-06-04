/** Ruta del módulo GNAHS de fidelización (fuera de la landing /club-top-rentals). */
export const CLUB_LOYALTY_PATH = "/loyalty";

/** Alias en español → misma página */
export const CLUB_LOYALTY_ALIAS_PATH = "/acceso";

export function sanitizeClubLoyaltyHref(href: string): string {
  const h = href.trim();
  if (
    !h ||
    h === "#" ||
    h === "#club-loyalty" ||
    /\/reservas/i.test(h) ||
    h === "/club-top-rentals"
  ) {
    return CLUB_LOYALTY_PATH;
  }
  if (h === CLUB_LOYALTY_ALIAS_PATH || h.startsWith("/acceso")) {
    return CLUB_LOYALTY_PATH;
  }
  return h;
}
