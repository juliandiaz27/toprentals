/**
 * Límite de intentos de login por IP: 5 fallidos en 15 minutos → bloqueo de 15 minutos.
 * En memoria (por instancia del servidor): no gasta operaciones de Blob y, sumado a la demora
 * fija en cada fallo, vuelve impráctico probar contraseñas a fuerza bruta.
 */

const MAX_FAILURES = 5;
const WINDOW_MS = 15 * 60 * 1000;
const FAILURE_DELAY_MS = 1200;

type Entry = { failures: number[]; blockedUntil: number };
const attempts = new Map<string, Entry>();

function entryFor(ip: string, now: number): Entry {
  const entry = attempts.get(ip) ?? { failures: [], blockedUntil: 0 };
  entry.failures = entry.failures.filter((t) => now - t < WINDOW_MS);
  attempts.set(ip, entry);
  return entry;
}

/** Minutos restantes de bloqueo para esa IP, o 0 si puede intentar. */
export function loginBlockedMinutes(ip: string): number {
  const now = Date.now();
  const entry = entryFor(ip, now);
  return entry.blockedUntil > now ? Math.ceil((entry.blockedUntil - now) / 60000) : 0;
}

/** Registra un intento fallido y espera un poco antes de responder. */
export async function recordLoginFailure(ip: string): Promise<void> {
  const now = Date.now();
  const entry = entryFor(ip, now);
  entry.failures.push(now);
  if (entry.failures.length >= MAX_FAILURES) {
    entry.blockedUntil = now + WINDOW_MS;
    entry.failures = [];
  }
  // Limpieza ocasional para no acumular IPs viejas
  if (attempts.size > 5000) {
    for (const [key, value] of attempts) {
      if (value.blockedUntil < now && value.failures.length === 0) attempts.delete(key);
    }
  }
  await new Promise((r) => setTimeout(r, FAILURE_DELAY_MS));
}

export function clearLoginFailures(ip: string): void {
  attempts.delete(ip);
}
