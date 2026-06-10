"use server";

import { headers } from "next/headers";
import { appendCareerApplication } from "@/lib/careers/storage";
import { saveCareerCv } from "@/lib/careers/saveCv";
import {
  notifyCareersTeam,
  resolveCareersRecipientEmail,
} from "@/lib/careers/notify";

export type SubmitCareerApplicationResult =
  | { ok: true }
  | { ok: false; error: string };

export async function submitCareerApplication(
  formData: FormData,
): Promise<SubmitCareerApplicationResult> {
  const honeypot = String(formData.get("website") ?? "").trim();
  if (honeypot) return { ok: true };

  const nombre = String(formData.get("nombre") ?? "").trim();
  const apellido = String(formData.get("apellido") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const telefono = String(formData.get("telefono") ?? "").trim();
  const recipientEmail = String(formData.get("recipientEmail") ?? "").trim();
  const cv = formData.get("cv");

  if (nombre.length < 2 || apellido.length < 2) {
    return { ok: false, error: "Completá nombre y apellido." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Indicá un email válido." };
  }
  if (!(cv instanceof File) || cv.size < 1) {
    return { ok: false, error: "Adjuntá tu CV (PDF, DOC o DOCX)." };
  }

  try {
    const { url, fileName } = await saveCareerCv(cv);
    const application = await appendCareerApplication({
      nombre: nombre.slice(0, 80),
      apellido: apellido.slice(0, 80),
      email: email.slice(0, 120),
      telefono: telefono.slice(0, 40),
      cvUrl: url,
      cvFileName: fileName.slice(0, 200),
    });

    const to = resolveCareersRecipientEmail(recipientEmail);
    const h = await headers();
    const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
    const proto = h.get("x-forwarded-proto") ?? "https";
    const origin = `${proto}://${host}`;

    try {
      await notifyCareersTeam(to, application, origin);
    } catch (emailError) {
      console.error("[careers] Email notification failed:", emailError);
    }

    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "No se pudo enviar la postulación.",
    };
  }
}
