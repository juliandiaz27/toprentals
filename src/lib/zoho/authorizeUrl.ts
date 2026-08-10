import {
  getZohoAccountsUrl,
  getZohoClientId,
  getZohoRedirectUri,
  isZohoConfigured,
  ZOHO_CRM_SCOPES,
} from "@/lib/zoho/config";

/** URL para que el cliente autorice la app (una sola vez). */
export function buildZohoAuthorizeUrl(state?: string): string | null {
  if (!isZohoConfigured()) return null;
  const params = new URLSearchParams({
    scope: ZOHO_CRM_SCOPES,
    client_id: getZohoClientId(),
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
    redirect_uri: getZohoRedirectUri(),
  });
  if (state) params.set("state", state);
  return `${getZohoAccountsUrl()}/oauth/v2/auth?${params.toString()}`;
}
