/** Rutas B2B / no venta directa al huésped — sin CTA flotante de reserva. */
const NON_B2C_PREFIXES = [
  "/admin",
  "/corporate",
  "/trabaja-con-nosotros",
  "/propietarios",
  "/inversores",
  "/desarrolladores",
  "/agencias",
  "/real-estate",
  "/reservas",
  "/mis-reservas",
] as const;

/** Rutas exactas B2C (funnel de reserva directa). */
const B2C_EXACT = ["/", "/club-top-rentals", "/nosotros", "/contacto"] as const;

/** Prefijos B2C (edificios, blog, etc.). */
const B2C_PREFIXES = ["/propiedades", "/blog"] as const;

function normalizePath(pathname: string): string {
  const base = (pathname.split("?")[0] ?? pathname).replace(/\/$/, "");
  return base || "/";
}

export function isNonB2cPath(pathname: string): boolean {
  const path = normalizePath(pathname);
  return NON_B2C_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  );
}

/** Páginas donde el huésped puede reservar (no corporativo ni B2B). */
export function isB2cConsumerPath(pathname: string): boolean {
  const path = normalizePath(pathname);
  if (isNonB2cPath(path)) return false;
  if ((B2C_EXACT as readonly string[]).includes(path)) return true;
  return B2C_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  );
}
