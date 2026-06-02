"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_SESSION_COOKIE,
  getAdminToken,
  isAuthed,
} from "@/lib/auth";
import { readImageConfig, writeImageConfig } from "@/lib/imageConfig";
import { saveUpload, deleteUploadByUrl } from "@/lib/upload";
import { revalidateConfigImages } from "@/lib/revalidate";

export type ActionResult = {
  ok: boolean;
  error?: string;
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
  const password = String(formData.get("password") ?? "");
  const token = getAdminToken();

  if (!token) {
    return { ok: false, error: "ADMIN_TOKEN no está configurado en el servidor." };
  }

  if (password !== token) {
    return { ok: false, error: "Contraseña incorrecta." };
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/admin/paginas/home-header");
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
    const url = await saveUpload(file, key);
    const config = await readImageConfig();
    config[key] = url;
    await writeImageConfig(config);
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
    revalidateConfigImages();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Error al restablecer." };
  }
}
