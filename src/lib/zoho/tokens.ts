import { promises as fs } from "node:fs";
import { dataFilePath } from "@/lib/repoRoot";
import {
  getZohoAccountsUrl,
  getZohoApiDomain,
  getZohoClientId,
  getZohoClientSecret,
  getZohoRedirectUri,
} from "./config";

type ZohoTokenFile = {
  refreshToken: string;
  accessToken?: string;
  accessTokenExpiresAt?: number;
  apiDomain?: string;
  updatedAt?: string;
};

type TokenResponse = {
  access_token?: string;
  refresh_token?: string;
  api_domain?: string;
  expires_in?: number;
  error?: string;
};

const TOKEN_FILE = () => dataFilePath("zoho-tokens.json");

async function readTokenFile(): Promise<ZohoTokenFile | null> {
  try {
    const raw = await fs.readFile(TOKEN_FILE(), "utf8");
    const parsed = JSON.parse(raw) as ZohoTokenFile;
    if (!parsed?.refreshToken) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function writeZohoTokens(partial: {
  refreshToken: string;
  accessToken?: string;
  expiresIn?: number;
  apiDomain?: string;
}): Promise<void> {
  const current = (await readTokenFile()) ?? { refreshToken: partial.refreshToken };
  const next: ZohoTokenFile = {
    refreshToken: partial.refreshToken || current.refreshToken,
    accessToken: partial.accessToken ?? current.accessToken,
    accessTokenExpiresAt:
      partial.accessToken && partial.expiresIn
        ? Date.now() + Math.max(0, partial.expiresIn - 60) * 1000
        : current.accessTokenExpiresAt,
    apiDomain: partial.apiDomain ?? current.apiDomain,
    updatedAt: new Date().toISOString(),
  };
  try {
    await fs.writeFile(TOKEN_FILE(), JSON.stringify(next, null, 2), "utf8");
  } catch (error) {
    console.warn("[zoho] No se pudo guardar zoho-tokens.json (ok en Vercel).", error);
  }
}

export async function getStoredRefreshToken(): Promise<string | null> {
  const fromEnv = String(process.env.ZOHO_REFRESH_TOKEN ?? "").trim();
  if (fromEnv) return fromEnv;
  const file = await readTokenFile();
  return file?.refreshToken?.trim() || null;
}

async function exchangeToken(
  body: Record<string, string>,
): Promise<TokenResponse> {
  const accounts = getZohoAccountsUrl();
  const res = await fetch(`${accounts}/oauth/v2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(body),
    cache: "no-store",
  });
  const data = (await res.json().catch(() => ({}))) as TokenResponse;
  if (!res.ok || data.error) {
    throw new Error(data.error || `Zoho token HTTP ${res.status}`);
  }
  return data;
}

/** Intercambia el code del callback por access + refresh token. */
export async function exchangeAuthorizationCode(code: string): Promise<{
  refreshToken: string;
  accessToken: string;
  apiDomain: string;
}> {
  const data = await exchangeToken({
    grant_type: "authorization_code",
    client_id: getZohoClientId(),
    client_secret: getZohoClientSecret(),
    redirect_uri: getZohoRedirectUri(),
    code,
  });

  if (!data.access_token) {
    throw new Error("Zoho no devolvió access_token");
  }
  if (!data.refresh_token) {
    throw new Error(
      "Zoho no devolvió refresh_token. Reautorizá con access_type=offline y prompt=consent.",
    );
  }

  const apiDomain = data.api_domain || getZohoApiDomain();
  await writeZohoTokens({
    refreshToken: data.refresh_token,
    accessToken: data.access_token,
    expiresIn: data.expires_in ?? 3600,
    apiDomain,
  });

  return {
    refreshToken: data.refresh_token,
    accessToken: data.access_token,
    apiDomain,
  };
}

/** Access token válido (refresca si hace falta). */
export async function getZohoAccessToken(): Promise<{
  accessToken: string;
  apiDomain: string;
}> {
  const file = await readTokenFile();
  const refreshToken = await getStoredRefreshToken();
  if (!refreshToken) {
    throw new Error(
      "Falta ZOHO_REFRESH_TOKEN. Autorizá en /api/zoho/authorize (logueado en admin).",
    );
  }

  if (
    file?.accessToken &&
    file.accessTokenExpiresAt &&
    file.accessTokenExpiresAt > Date.now() + 30_000 &&
    file.refreshToken === refreshToken
  ) {
    return {
      accessToken: file.accessToken,
      apiDomain: file.apiDomain || getZohoApiDomain(),
    };
  }

  const data = await exchangeToken({
    grant_type: "refresh_token",
    client_id: getZohoClientId(),
    client_secret: getZohoClientSecret(),
    refresh_token: refreshToken,
  });

  if (!data.access_token) {
    throw new Error("Zoho no devolvió access_token al refrescar");
  }

  const apiDomain = data.api_domain || file?.apiDomain || getZohoApiDomain();
  await writeZohoTokens({
    refreshToken,
    accessToken: data.access_token,
    expiresIn: data.expires_in ?? 3600,
    apiDomain,
  });

  return { accessToken: data.access_token, apiDomain };
}
