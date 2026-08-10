/** Configuración Zoho CRM (solo servidor). */

export function getZohoClientId(): string {
  return String(process.env.ZOHO_CLIENT_ID ?? "").trim();
}

export function getZohoClientSecret(): string {
  return String(process.env.ZOHO_CLIENT_SECRET ?? "").trim();
}

export function getZohoRedirectUri(): string {
  return (
    String(process.env.ZOHO_REDIRECT_URI ?? "").trim() ||
    "https://thetoprentals.com/api/zoho/callback"
  );
}

export function getZohoAccountsUrl(): string {
  return (
    String(process.env.ZOHO_ACCOUNTS_URL ?? "").trim() ||
    "https://accounts.zoho.com"
  );
}

export function getZohoApiDomain(): string {
  return (
    String(process.env.ZOHO_API_DOMAIN ?? "").trim() ||
    "https://www.zohoapis.com"
  );
}

/** Scope mínimo para crear Leads. */
export const ZOHO_CRM_SCOPES = "ZohoCRM.modules.leads.CREATE,ZohoCRM.modules.leads.READ";

export function isZohoConfigured(): boolean {
  return Boolean(getZohoClientId() && getZohoClientSecret());
}
