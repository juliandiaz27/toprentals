import { DEFAULT_CAREERS_RRHH_EMAIL } from "./constants";
import type { CareerApplicationStored } from "./types";

export function resolveCareersRecipientEmail(
  fromContent?: string,
): string {
  const fromEnv = process.env.CAREERS_RRHH_EMAIL?.trim();
  if (fromEnv) return fromEnv;
  const fromCms = fromContent?.trim();
  if (fromCms) return fromCms;
  return DEFAULT_CAREERS_RRHH_EMAIL;
}

export async function notifyCareersTeam(
  to: string,
  application: CareerApplicationStored,
  siteOrigin: string,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return;

  const from =
    process.env.RESEND_FROM_EMAIL?.trim() ??
    "Top Rentals <noreply@thetoprentals.com>";

  const cvLink = application.cvUrl.startsWith("http")
    ? application.cvUrl
    : `${siteOrigin.replace(/\/$/, "")}${application.cvUrl.startsWith("/") ? "" : "/"}${application.cvUrl}`;

  const html = `
    <h2>Nueva postulación — Top Rentals</h2>
    <p><strong>Nombre:</strong> ${escapeHtml(application.nombre)} ${escapeHtml(application.apellido)}</p>
    <p><strong>Email:</strong> ${escapeHtml(application.email)}</p>
    <p><strong>Teléfono:</strong> ${escapeHtml(application.telefono || "—")}</p>
    <p><strong>CV:</strong> <a href="${escapeHtml(cvLink)}">${escapeHtml(application.cvFileName)}</a></p>
    <p><small>ID: ${escapeHtml(application.id)} · ${escapeHtml(application.createdAt)}</small></p>
  `.trim();

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `CV — ${application.nombre} ${application.apellido}`,
      html,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(
      `No se pudo enviar el aviso por email (${res.status}). ${detail}`.trim(),
    );
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
