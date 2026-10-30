/**
 * Sesión del panel: cookie firmada (HMAC-SHA256) con quién inició sesión.
 * Solo usa Web Crypto, así funciona tanto en el proxy como en el servidor.
 *
 * Formato: base64url(JSON del usuario) + "." + firma.
 * Compatibilidad: una cookie que contiene exactamente ADMIN_TOKEN (sesiones anteriores)
 * se acepta como «Administrador».
 */

export const ADMIN_SESSION_COOKIE = "admin-session";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export type AdminRole = "owner" | "editor";

export type AdminSession = {
  /** id del usuario, o "owner" para la contraseña general. */
  uid: string;
  name: string;
  email: string;
  role: AdminRole;
  /** Vencimiento (epoch en segundos). */
  exp: number;
};

/** Sesión de quien entra con la contraseña general (ADMIN_TOKEN). */
export function generalPasswordSession(): Omit<AdminSession, "exp"> {
  return { uid: "owner", name: "Administrador", email: "", role: "owner" };
}

function secret(): string | undefined {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_TOKEN;
}

function base64url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64url(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

async function sign(payload: string, key: string): Promise<string> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(payload));
  return base64url(new Uint8Array(signature));
}

/** Comparación en tiempo constante (evita filtrar la firma por tiempos). */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createSessionCookieValue(
  user: Omit<AdminSession, "exp">,
): Promise<string> {
  const key = secret();
  if (!key) throw new Error("ADMIN_TOKEN no está configurado en el servidor.");
  const session: AdminSession = {
    ...user,
    exp: Math.floor(Date.now() / 1000) + ADMIN_SESSION_MAX_AGE,
  };
  const payload = base64url(new TextEncoder().encode(JSON.stringify(session)));
  return `${payload}.${await sign(payload, key)}`;
}

/** Devuelve la sesión si la cookie es válida y no venció; si no, null. */
export async function readSessionCookieValue(
  value: string | undefined,
): Promise<AdminSession | null> {
  const key = secret();
  if (!key || !value) return null;

  // Sesiones anteriores (cookie = contraseña general)
  const token = process.env.ADMIN_TOKEN;
  if (token && safeEqual(value, token)) {
    return { ...generalPasswordSession(), exp: Number.MAX_SAFE_INTEGER };
  }

  const [payload, signature] = value.split(".");
  if (!payload || !signature) return null;
  if (!safeEqual(signature, await sign(payload, key))) return null;

  try {
    const session = JSON.parse(new TextDecoder().decode(fromBase64url(payload))) as AdminSession;
    if (!session.uid || session.exp < Date.now() / 1000) return null;
    return session;
  } catch {
    return null;
  }
}
