/**
 * Claves GNAHS solo para código de servidor (Route Handlers, Server Actions).
 * Nunca importar esto en componentes "use client".
 */
export function getGnahsServerCredentials() {
  const secretKey = process.env.GNAHS_SECRET_KEY;
  const downloadKey = process.env.GNAHS_DOWNLOAD_KEY;

  if (!secretKey || !downloadKey) {
    return null;
  }

  return { secretKey, downloadKey };
}
