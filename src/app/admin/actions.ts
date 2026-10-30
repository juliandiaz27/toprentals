"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, getAdminToken, isAuthed } from "@/lib/auth";
import {
  ADMIN_SESSION_MAX_AGE,
  createSessionCookieValue,
  generalPasswordSession,
} from "@/lib/adminSession";
import { authenticateAdminUser } from "@/lib/adminUsers";
import { readImageConfig, writeImageConfig } from "@/lib/imageConfig";
import { CONFIG_IMAGE_SLOTS } from "@/lib/adminImageSlots";
import { validateFileAgainstGuide } from "@/lib/mediaUploadGuide";
import { saveUpload, deleteUploadByUrl } from "@/lib/upload";
import { revalidateConfigImages } from "@/lib/revalidate";

import { logAdminChange } from "@/lib/adminAudit";
import {
  clearLoginFailures,
  loginBlockedMinutes,
  recordLoginFailure,
} from "@/lib/loginRateLimit";
export type ActionResult = {
  ok: boolean;
  error?: string;
  /** Catálogo guardado (p. ej. tras subir galería). */
  listings?: import("@/lib/properties/catalogTypes").PropertyListingStored[];
  featuredSlugs?: string[];
};

async function requireAuth(): Promise<void> {
  if (!(await isAuthed())) {
    throw new Error("No autorizado");
  }
}

export async function login(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const token = getAdminToken();

  if (!token) {
    return { ok: false, error: "ADMIN_TOKEN no está configurado en el servidor." };
  }

  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0]?.trim() || h.get("x-real-ip") || "local";
  const blocked = loginBlockedMinutes(ip);
  if (blocked) {
    return {
      ok: false,
      error: `Demasiados intentos fallidos. Probá de nuevo en ${blocked} minuto(s).`,
    };
  }

  // Con email: usuario del equipo. Sin email: contraseña general («Administrador»).
  let user: { uid: string; name: string; email: string; role: "owner" | "editor" };
  if (email) {
    const found = await authenticateAdminUser(email, password);
    if (!found) {
      await recordLoginFailure(ip);
      return { ok: false, error: "Email o contraseña incorrectos." };
    }
    user = { uid: found.id, name: found.name, email: found.email, role: found.role };
  } else {
    if (password !== token) {
      await recordLoginFailure(ip);
      return { ok: false, error: "Contraseña incorrecta." };
    }
    user = generalPasswordSession();
  }

  clearLoginFailures(ip);
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, await createSessionCookieValue(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
  });
  await logAdminChange("Inició sesión", "Panel", user);

  redirect("/admin");
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
  redirect("/admin/login");
}

export async function uploadImage(
  key: string,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await requireAuth();
    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return { ok: false, error: "Seleccioná una imagen." };
    }
    const slot = CONFIG_IMAGE_SLOTS.find((s) => s.key === key);
    const guide = slot?.uploadGuide;
    const sizeError = validateFileAgainstGuide(file, guide);
    if (sizeError) {
      return { ok: false, error: sizeError };
    }
    const url = await saveUpload(file, key, { maxSizeMb: guide?.maxSizeMb });
    const config = await readImageConfig();
    config[key] = url;
    await writeImageConfig(config);
    await logAdminChange("Subió imagen", key);
    revalidateConfigImages();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Error al subir." };
  }
}

export async function removeImage(key: string): Promise<ActionResult> {
  try {
    await requireAuth();
    const config = await readImageConfig();
    const current = config[key];
    if (current?.startsWith("/uploads/")) {
      await deleteUploadByUrl(current);
    }
    delete config[key];
    await writeImageConfig(config);
    await logAdminChange("Restableció imagen", key);
    revalidateConfigImages();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Error al restablecer." };
  }
}
