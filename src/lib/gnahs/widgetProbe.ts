/** Hosts donde GNAHS suele devolver 401 hasta autorizar el dominio. */
export function isLocalDevHost(hostname?: string): boolean {
  const h =
    hostname ??
    (typeof window !== "undefined" ? window.location.hostname : "");
  return h === "localhost" || h === "127.0.0.1" || h === "[::1]";
}

/**
 * Comprueba si la API del widget responde (evita inicializar en local sin dominio autorizado).
 * En producción no se llama: el widget ya funciona allí.
 */
export async function probeWidgetApi(
  apiUrl: string,
  uuid: string,
): Promise<boolean> {
  const base = apiUrl.replace(/\/$/, "");
  try {
    const res = await fetch(`${base}/api/widget`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ uuid }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
