/** Rutas del motor de reservas (misma pestaña, con header/footer del sitio). */
export function isReservasUrl(href: string): boolean {
  const path = (href.split("?")[0] ?? href).replace(/\/$/, "") || "/";
  return (
    path === "/reservas" ||
    path.startsWith("/reservas/") ||
    path === "/reservar"
  );
}

/** Sin target _blank: el motor se muestra en /reservas dentro del layout Top Rentals. */
export function reservasLinkProps(_href: string) {
  return {};
}
