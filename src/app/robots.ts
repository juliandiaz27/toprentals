import type { MetadataRoute } from "next";
import { absoluteUrl, isIndexableHost } from "@/lib/seo";

export const dynamic = "force-dynamic";

/**
 * En el dominio canónico: se indexa todo menos el panel, la API y el área de clientes.
 * En cualquier otro host (vercel.app, previews): no se indexa nada.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  if (!(await isIndexableHost())) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/", "/mis-reservas", "/agencias", "/loyalty", "/reservas?"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
