import { readJsonFile, writeJsonFile } from "@/lib/fsJson";
import { dataFilePath } from "@/lib/repoRoot";
import { getAdminSession } from "@/lib/auth";

/**
 * Registro de actividad del panel: quién guardó qué y cuándo.
 * Se guarda en `admin-audit-log.json` (Blob en producción); se conservan los últimos 1000 eventos.
 */

export type AdminAuditEntry = {
  at: string;
  userId: string;
  userName: string;
  /** Qué se hizo, en palabras: «Guardó», «Inició sesión», «Creó usuario»… */
  action: string;
  /** Sobre qué: «Página Home (español)», «Edificio Hub Núñez»… */
  target: string;
};

type AuditFile = { entries: AdminAuditEntry[] };

const MAX_ENTRIES = 1000;
const auditPath = () => dataFilePath("admin-audit-log.json");

export async function readAdminAudit(limit = MAX_ENTRIES): Promise<AdminAuditEntry[]> {
  const data = await readJsonFile<AuditFile>(auditPath(), { entries: [] });
  const entries = Array.isArray(data.entries) ? data.entries : [];
  return entries.slice(0, limit);
}

/**
 * Anota un evento con el usuario de la sesión actual. Nunca hace fallar el guardado:
 * si el registro no se puede escribir, se informa en consola y sigue.
 */
export async function logAdminChange(
  action: string,
  target: string,
  user?: { uid: string; name: string },
): Promise<void> {
  try {
    const who = user ?? (await getAdminSession());
    const entry: AdminAuditEntry = {
      at: new Date().toISOString(),
      userId: who?.uid ?? "desconocido",
      userName: who?.name ?? "Desconocido",
      action,
      target,
    };
    const entries = await readAdminAudit();
    await writeJsonFile<AuditFile>(auditPath(), {
      entries: [entry, ...entries].slice(0, MAX_ENTRIES),
    });
  } catch (err) {
    console.error("[admin-audit] no se pudo registrar el cambio", err);
  }
}

/** «Página Home (inglés)» a partir del slug y el idioma. */
export function describeLanguage(language: string): string {
  return language === "en" ? "inglés" : "español";
}
