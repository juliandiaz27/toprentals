import { NextResponse } from "next/server";
import { exchangeAuthorizationCode } from "@/lib/zoho/tokens";

/**
 * Callback OAuth (Redirect URI en Zoho API Console).
 * Guarda refresh token en zoho-tokens.json (local) y muestra el valor
 * para pegarlo en Vercel como ZOHO_REFRESH_TOKEN.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error) {
    return htmlPage(
      "Zoho — error",
      `<p>Zoho devolvió un error: <code>${escapeHtml(error)}</code></p>
       <p><a href="/admin">Volver al admin</a></p>`,
      400,
    );
  }

  if (!code) {
    return htmlPage(
      "Zoho — sin código",
      `<p>Falta el parámetro <code>code</code> en el callback.</p>
       <p><a href="/api/zoho/authorize">Reintentar autorización</a></p>`,
      400,
    );
  }

  try {
    const tokens = await exchangeAuthorizationCode(code);
    return htmlPage(
      "Zoho conectado",
      `<p><strong>Listo.</strong> Ya tenemos el refresh token.</p>
       <ol>
         <li>Copiá el token de abajo.</li>
         <li>Pegalo en <code>.env.local</code> como <code>ZOHO_REFRESH_TOKEN=...</code>.</li>
         <li>En Vercel: Project → Settings → Environment Variables → misma clave.</li>
         <li>Redeploy si hace falta.</li>
       </ol>
       <p><label>ZOHO_REFRESH_TOKEN</label></p>
       <textarea readonly rows="4" style="width:100%;font-family:monospace;font-size:12px;padding:12px;border-radius:8px;border:1px solid #ccc">${escapeHtml(tokens.refreshToken)}</textarea>
       <p style="margin-top:1.5rem"><a href="/admin">Ir al admin</a></p>`,
      200,
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Error desconocido";
    console.error("[zoho/callback]", e);
    return htmlPage(
      "Zoho — fallo al intercambiar code",
      `<p>${escapeHtml(message)}</p>
       <p><a href="/api/zoho/authorize">Reintentar</a> (tenés que estar logueado en admin).</p>`,
      500,
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

function htmlPage(title: string, body: string, status: number) {
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 640px; margin: 48px auto; padding: 0 20px; color: #111; line-height: 1.5; }
    code { background: #f4f4f4; padding: 2px 6px; border-radius: 4px; }
    a { color: #0b57d0; }
  </style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  ${body}
</body>
</html>`;
  return new NextResponse(html, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
