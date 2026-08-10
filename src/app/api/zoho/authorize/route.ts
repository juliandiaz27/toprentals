import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { isZohoConfigured } from "@/lib/zoho/config";
import { buildZohoAuthorizeUrl } from "@/lib/zoho/authorizeUrl";

/**
 * Inicia OAuth de Zoho. Solo con sesión admin.
 * GET /api/zoho/authorize → redirect a Zoho.
 */
export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json(
      { ok: false, error: "Iniciá sesión en /admin/login primero." },
      { status: 401 },
    );
  }

  if (!isZohoConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Faltan ZOHO_CLIENT_ID / ZOHO_CLIENT_SECRET en el entorno." },
      { status: 500 },
    );
  }

  const url = buildZohoAuthorizeUrl("top-rentals-web");
  if (!url) {
    return NextResponse.json({ ok: false, error: "No se pudo armar la URL de Zoho." }, { status: 500 });
  }

  return NextResponse.redirect(url);
}
