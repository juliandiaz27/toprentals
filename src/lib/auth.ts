import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE,
  readSessionCookieValue,
  type AdminSession,
} from "@/lib/adminSession";

export { ADMIN_SESSION_COOKIE };

export function getAdminToken(): string | undefined {
  return process.env.ADMIN_TOKEN;
}

/** Usuario con sesión iniciada en el panel, o null. */
export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  return readSessionCookieValue(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
}

export async function isAuthed(): Promise<boolean> {
  return (await getAdminSession()) !== null;
}
