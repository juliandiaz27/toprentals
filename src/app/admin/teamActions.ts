"use server";

import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import type { AdminRole } from "@/lib/adminSession";
import {
  authenticateAdminUser,
  createAdminUser,
  deleteAdminUser,
  readAdminUsers,
  updateAdminUser,
} from "@/lib/adminUsers";
import { logAdminChange } from "@/lib/adminAudit";

export type TeamActionResult = { ok: boolean; error?: string; message?: string };

const MIN_PASSWORD = 8;
const ROLE_LABEL: Record<AdminRole, string> = { owner: "Dueño", editor: "Editor" };

function parseRole(value: FormDataEntryValue | null): AdminRole {
  return value === "owner" ? "owner" : "editor";
}

async function requireOwner() {
  const session = await getAdminSession();
  if (!session || session.role !== "owner") {
    throw new Error("Solo un dueño del panel puede administrar el equipo.");
  }
  return session;
}

function fail(e: unknown): TeamActionResult {
  return { ok: false, error: e instanceof Error ? e.message : "No se pudo completar la acción." };
}

export async function createTeamMember(formData: FormData): Promise<TeamActionResult> {
  try {
    await requireOwner();
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const role = parseRole(formData.get("role"));
    if (!name || !email.includes("@")) {
      return { ok: false, error: "Completá nombre y un email válido." };
    }
    if (password.length < MIN_PASSWORD) {
      return { ok: false, error: `La contraseña debe tener al menos ${MIN_PASSWORD} caracteres.` };
    }
    const user = await createAdminUser({ name, email, role, password, createdBy: (await getAdminSession())!.name });
    await logAdminChange("Creó usuario", `${user.name} (${ROLE_LABEL[role]})`);
    revalidatePath("/admin/equipo");
    return { ok: true, message: `Listo: ${user.name} ya puede ingresar con ${user.email}.` };
  } catch (e) {
    return fail(e);
  }
}

export async function updateTeamMember(formData: FormData): Promise<TeamActionResult> {
  try {
    const session = await requireOwner();
    const id = String(formData.get("id") ?? "");
    const role = parseRole(formData.get("role"));
    const password = String(formData.get("password") ?? "");
    if (password && password.length < MIN_PASSWORD) {
      return { ok: false, error: `La contraseña debe tener al menos ${MIN_PASSWORD} caracteres.` };
    }
    if (id === session.uid && role !== "owner") {
      return { ok: false, error: "No podés quitarte el rol de dueño a vos mismo." };
    }
    const user = await updateAdminUser(id, { role, password: password || undefined });
    await logAdminChange(
      "Actualizó usuario",
      `${user.name}: ${ROLE_LABEL[user.role]}${password ? " · nueva contraseña" : ""}`,
    );
    revalidatePath("/admin/equipo");
    return { ok: true, message: `Cambios guardados para ${user.name}.` };
  } catch (e) {
    return fail(e);
  }
}

export async function removeTeamMember(id: string): Promise<TeamActionResult> {
  try {
    const session = await requireOwner();
    if (id === session.uid) {
      return { ok: false, error: "No podés eliminar tu propio usuario." };
    }
    const user = await deleteAdminUser(id);
    await logAdminChange("Eliminó usuario", user.name);
    revalidatePath("/admin/equipo");
    return { ok: true, message: `${user.name} ya no tiene acceso al panel.` };
  } catch (e) {
    return fail(e);
  }
}

/** Cualquier usuario del equipo puede cambiar su propia contraseña. */
export async function changeOwnPassword(formData: FormData): Promise<TeamActionResult> {
  try {
    const session = await getAdminSession();
    if (!session) return { ok: false, error: "No autorizado" };
    if (session.uid === "owner") {
      return {
        ok: false,
        error: "La contraseña general se cambia en Vercel (variable ADMIN_TOKEN).",
      };
    }
    const current = String(formData.get("current") ?? "");
    const next = String(formData.get("next") ?? "");
    if (next.length < MIN_PASSWORD) {
      return { ok: false, error: `La nueva contraseña debe tener al menos ${MIN_PASSWORD} caracteres.` };
    }
    const users = await readAdminUsers();
    const me = users.find((u) => u.id === session.uid);
    if (!me || !(await authenticateAdminUser(me.email, current))) {
      return { ok: false, error: "La contraseña actual no es correcta." };
    }
    await updateAdminUser(me.id, { password: next });
    await logAdminChange("Cambió su contraseña", me.name);
    return { ok: true, message: "Contraseña actualizada." };
  } catch (e) {
    return fail(e);
  }
}
