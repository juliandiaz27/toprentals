import { NextResponse } from "next/server";
import {
  createZohoLead,
  ZOHO_LEAD_SOURCE_CORPORATE,
} from "@/lib/zoho/leads";
import { getStoredRefreshToken } from "@/lib/zoho/tokens";

function isValidEmail(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const email = value.trim();
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const honeypot = typeof body.website === "string" ? body.website.trim() : "";
    if (honeypot) {
      return NextResponse.json({ ok: true });
    }

    const company = String(body.empresa ?? body.company ?? "").trim();
    const firstName = String(body.nombre ?? body.firstName ?? "").trim();
    const lastName = String(body.apellido ?? body.lastName ?? "").trim();
    const email = body.email;
    const phone = String(body.telefono ?? body.phone ?? "").trim();
    const jobTitle = String(body.cargo ?? body.jobTitle ?? "").trim();

    if (!company || !firstName || !lastName || !phone) {
      return NextResponse.json(
        { ok: false, error: "Completá los campos obligatorios." },
        { status: 400 },
      );
    }
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { ok: false, error: "Email inválido." },
        { status: 400 },
      );
    }

    const refresh = await getStoredRefreshToken();
    if (refresh) {
      const zoho = await createZohoLead({
        company,
        firstName,
        lastName,
        email: email.trim(),
        phone,
        jobTitle: jobTitle || undefined,
        leadSource: ZOHO_LEAD_SOURCE_CORPORATE,
        description: "Solicitud de acceso corporate desde thetoprentals.com",
      });
      if (!zoho.ok) {
        console.error("[corporate] Zoho lead error:", zoho.error);
        // No bloqueamos al usuario: el lead se puede reintentar desde logs.
      }
    } else {
      console.warn(
        "[corporate] ZOHO_REFRESH_TOKEN ausente — lead no enviado a Zoho.",
        { company, email: email.trim() },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[corporate] Error", error);
    return NextResponse.json(
      { ok: false, error: "No pudimos enviar la solicitud. Intentá más tarde." },
      { status: 500 },
    );
  }
}
