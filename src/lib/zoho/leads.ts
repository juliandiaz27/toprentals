import { getZohoAccessToken } from "./tokens";

export type ZohoLeadInput = {
  firstName?: string;
  lastName: string;
  email?: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  leadSource: string;
  description?: string;
};

type ZohoInsertResponse = {
  data?: Array<{
    code?: string;
    status?: string;
    message?: string;
    details?: { id?: string };
  }>;
};

/**
 * Crea un Lead en Zoho CRM.
 * Lead_Source usa el nombre API estándar (en UI puede verse como «Fuente…»).
 */
export async function createZohoLead(
  input: ZohoLeadInput,
): Promise<{ ok: true; id?: string } | { ok: false; error: string }> {
  try {
    const { accessToken, apiDomain } = await getZohoAccessToken();

    const record: Record<string, string> = {
      Last_Name: input.lastName.slice(0, 80) || "Web",
      Lead_Source: input.leadSource.slice(0, 120),
    };
    if (input.firstName?.trim()) record.First_Name = input.firstName.trim().slice(0, 40);
    if (input.email?.trim()) record.Email = input.email.trim().slice(0, 100);
    if (input.phone?.trim()) record.Phone = input.phone.trim().slice(0, 50);
    if (input.company?.trim()) record.Company = input.company.trim().slice(0, 200);
    if (input.jobTitle?.trim()) {
      record.Designation = input.jobTitle.trim().slice(0, 100);
    }
    if (input.description?.trim()) {
      record.Description = input.description.trim().slice(0, 2000);
    }

    const res = await fetch(`${apiDomain}/crm/v2/Leads`, {
      method: "POST",
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: [record] }),
      cache: "no-store",
    });

    const payload = (await res.json().catch(() => ({}))) as ZohoInsertResponse;
    const row = payload.data?.[0];

    if (!res.ok || row?.status === "error" || row?.code === "ERROR") {
      const message =
        row?.message ||
        `Zoho Leads HTTP ${res.status}`;
      console.error("[zoho] create lead failed", payload);
      return { ok: false, error: message };
    }

    return { ok: true, id: row?.details?.id };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error Zoho";
    console.error("[zoho] create lead exception", error);
    return { ok: false, error: message };
  }
}

export const ZOHO_LEAD_SOURCE_NEWSLETTER = "Newsletter web";
export const ZOHO_LEAD_SOURCE_CORPORATE = "Corporate web";
