import type { PageContent } from "./types";

export type ContactoPageContent = {
  title: string;
  subtitle: string;
  email: string;
  whatsappLabel: string;
  officesTitle: string;
  officeBa: string;
  officeEc: string;
};

export function pickContactoPage(raw: PageContent): ContactoPageContent {
  const c = (raw.contacto ?? raw) as Record<string, unknown>;
  return {
    title: String(c.title ?? "Contacto").trim() || "Contacto",
    subtitle: String(
      c.subtitle ??
        "Escribinos para reservas, alianzas corporativas, inversiones o consultas generales.",
    ).trim(),
    email: String(c.email ?? "info@thetoprentals.com").trim() || "info@thetoprentals.com",
    whatsappLabel: String(c.whatsappLabel ?? "WhatsApp").trim() || "WhatsApp",
    officesTitle: String(c.officesTitle ?? "Oficinas").trim() || "Oficinas",
    officeBa: String(c.officeBa ?? "Buenos Aires, Argentina").trim(),
    officeEc: String(c.officeEc ?? "Quito, Ecuador").trim(),
  };
}
