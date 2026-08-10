import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import {
  createZohoLead,
  ZOHO_LEAD_SOURCE_NEWSLETTER,
} from "@/lib/zoho/leads";
import { getStoredRefreshToken } from "@/lib/zoho/tokens";

type SignupRecord = {
  email: string;
  project?: string;
  source?: string;
  createdAt: string;
};

const FILE_PATH = path.join(process.cwd(), "newsletter-signups.json");

async function appendSignup(record: SignupRecord): Promise<void> {
  let current: SignupRecord[] = [];
  try {
    const raw = await fs.readFile(FILE_PATH, "utf8");
    current = JSON.parse(raw) as SignupRecord[];
    if (!Array.isArray(current)) current = [];
  } catch {
    current = [];
  }
  current.push(record);
  await fs.writeFile(FILE_PATH, JSON.stringify(current, null, 2), "utf8");
}

function isValidEmail(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const email = value.trim();
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = body.email;
    const source =
      typeof body.source === "string" ? body.source.slice(0, 120) : undefined;
    const project =
      typeof body.project === "string"
        ? body.project.trim().slice(0, 160)
        : undefined;
    const honeypot =
      typeof body.website === "string" ? body.website.trim() : "";

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { ok: false, error: "Email inválido." },
        { status: 400 },
      );
    }

    if (!honeypot) {
      const trimmed = email.trim();
      await appendSignup({
        email: trimmed,
        project: project || undefined,
        source,
        createdAt: new Date().toISOString(),
      });

      const refresh = await getStoredRefreshToken();
      if (refresh) {
        const localPart = trimmed.split("@")[0] || "Newsletter";
        const zoho = await createZohoLead({
          lastName: localPart.slice(0, 80),
          email: trimmed,
          company: project ? `Proyecto: ${project}` : "Newsletter web",
          leadSource: ZOHO_LEAD_SOURCE_NEWSLETTER,
          description: [
            "Suscripción newsletter / desarrollos",
            project ? `Proyecto: ${project}` : null,
            source ? `Source: ${source}` : null,
          ]
            .filter(Boolean)
            .join("\n"),
        });
        if (!zoho.ok) {
          console.error("[newsletter] Zoho lead error:", zoho.error);
        }
      } else {
        console.warn(
          "[newsletter] ZOHO_REFRESH_TOKEN ausente — lead no enviado a Zoho.",
        );
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[newsletter] Error al registrar email", error);
    return NextResponse.json(
      {
        ok: false,
        error: "No pudimos registrar tu email. Intentá de nuevo más tarde.",
      },
      { status: 500 },
    );
  }
}
