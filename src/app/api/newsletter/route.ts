import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";

type SignupRecord = {
  email: string;
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
    const source = typeof body.source === "string" ? body.source.slice(0, 120) : undefined;
    const honeypot = typeof body.website === "string" ? body.website.trim() : "";

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { ok: false, error: "Email inválido." },
        { status: 400 },
      );
    }

    // Honeypot simple: si el campo oculto viene relleno, ignoramos el registro.
    if (!honeypot) {
      await appendSignup({
        email: email.trim(),
        source,
        createdAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[newsletter] Error al registrar email", error);
    return NextResponse.json(
      { ok: false, error: "No pudimos registrar tu email. Intentá de nuevo más tarde." },
      { status: 500 },
    );
  }
}

