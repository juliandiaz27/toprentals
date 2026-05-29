import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "admin-session";

export function getAdminToken(): string | undefined {
  return process.env.ADMIN_TOKEN;
}

export async function isAuthed(): Promise<boolean> {
  const token = getAdminToken();
  if (!token) return false;
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE);
  return session?.value === token;
}
