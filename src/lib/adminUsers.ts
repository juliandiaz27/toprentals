import { randomBytes, randomUUID, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { readJsonFile, writeJsonFile } from "@/lib/fsJson";
import { dataFilePath } from "@/lib/repoRoot";
import type { AdminRole } from "@/lib/adminSession";

/**
 * Usuarios del panel. Se guardan en `admin-users.json` (Blob en producción) con la contraseña
 * cifrada (scrypt + sal). El archivo no se versiona en git.
 */

const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: Buffer,
  keylen: number,
) => Promise<Buffer>;

export type AdminUserStored = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  passwordHash: string;
  createdAt: string;
  createdBy?: string;
};

/** Lo que se muestra en el panel (sin la contraseña). */
export type AdminUserPublic = Omit<AdminUserStored, "passwordHash">;

type UsersFile = { users: AdminUserStored[] };

const usersPath = () => dataFilePath("admin-users.json");

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scryptAsync(password, salt, 64);
  return `scrypt:${salt.toString("hex")}:${hash.toString("hex")}`;
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, saltHex, hashHex] = stored.split(":");
  if (scheme !== "scrypt" || !saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  const actual = await scryptAsync(password, Buffer.from(saltHex, "hex"), expected.length);
  return timingSafeEqual(actual, expected);
}

export async function readAdminUsers(): Promise<AdminUserStored[]> {
  const data = await readJsonFile<UsersFile>(usersPath(), { users: [] });
  return Array.isArray(data.users) ? data.users : [];
}

async function writeAdminUsers(users: AdminUserStored[]): Promise<void> {
  await writeJsonFile<UsersFile>(usersPath(), { users });
}

export function toPublicUser(user: AdminUserStored): AdminUserPublic {
  const { passwordHash: _hash, ...rest } = user;
  void _hash;
  return rest;
}

const normalizeEmail = (email: string) => email.trim().toLowerCase();

/** Usuario si email y contraseña coinciden; si no, null. */
export async function authenticateAdminUser(
  email: string,
  password: string,
): Promise<AdminUserStored | null> {
  const users = await readAdminUsers();
  const user = users.find((u) => u.email === normalizeEmail(email));
  if (!user) return null;
  return (await verifyPassword(password, user.passwordHash)) ? user : null;
}

export async function createAdminUser(input: {
  name: string;
  email: string;
  role: AdminRole;
  password: string;
  createdBy: string;
}): Promise<AdminUserStored> {
  const users = await readAdminUsers();
  const email = normalizeEmail(input.email);
  if (users.some((u) => u.email === email)) {
    throw new Error("Ya existe un usuario con ese email.");
  }
  const user: AdminUserStored = {
    id: randomUUID(),
    name: input.name.trim(),
    email,
    role: input.role,
    passwordHash: await hashPassword(input.password),
    createdAt: new Date().toISOString(),
    createdBy: input.createdBy,
  };
  await writeAdminUsers([...users, user]);
  return user;
}

export async function updateAdminUser(
  id: string,
  patch: { name?: string; role?: AdminRole; password?: string },
): Promise<AdminUserStored> {
  const users = await readAdminUsers();
  const index = users.findIndex((u) => u.id === id);
  if (index < 0) throw new Error("Usuario no encontrado.");
  const current = users[index]!;
  const next: AdminUserStored = {
    ...current,
    ...(patch.name?.trim() ? { name: patch.name.trim() } : {}),
    ...(patch.role ? { role: patch.role } : {}),
    ...(patch.password ? { passwordHash: await hashPassword(patch.password) } : {}),
  };
  users[index] = next;
  await writeAdminUsers(users);
  return next;
}

export async function deleteAdminUser(id: string): Promise<AdminUserStored> {
  const users = await readAdminUsers();
  const user = users.find((u) => u.id === id);
  if (!user) throw new Error("Usuario no encontrado.");
  await writeAdminUsers(users.filter((u) => u.id !== id));
  return user;
}
