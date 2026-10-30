import type { Metadata } from "next";
import { headers } from "next/headers";
import { getNested } from "@/lib/pageContent/nested";
import type { PageContent } from "@/lib/pageContent/types";
import { plainTextFromRichHtml } from "@/lib/richText/sanitize";

/**
 * SEO del sitio: dominio canónico, metadata por página (title, description, canonical,
 * Open Graph, robots) y datos estructurados.
 *
 * Indexación: solo se permite cuando el sitio se sirve desde el dominio canónico
 * (NEXT_PUBLIC_SITE_URL, por defecto www.thetoprentals.com). En toprentals.vercel.app,
 * localhost o cualquier otro host se marca noindex, así la versión de prueba no compite
 * con el sitio publicado y al apuntar el dominio se indexa sola, sin tocar nada.
 */

export const SITE_NAME = "Top Rentals";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.thetoprentals.com").replace(/\/$/, "");
const SITE_HOST = new URL(SITE_URL).host;
const DEFAULT_OG_IMAGE = "/images/home/investor-cta.png";

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

/** true si la request llega por el dominio canónico (con o sin www). */
export async function isIndexableHost(): Promise<boolean> {
  const h = await headers();
  const host = (h.get("x-forwarded-host") ?? h.get("host") ?? "").split(",")[0]!.trim().toLowerCase();
  const bare = (value: string) => value.replace(/^www\./, "");
  return Boolean(host) && bare(host) === bare(SITE_HOST);
}

/** Recorta en el último espacio antes de `max` caracteres (meta description ~155). */
export function truncateText(text: string, max = 155): string {
  const plain = plainTextFromRichHtml(text).replace(/\s+/g, " ").trim();
  if (plain.length <= max) return plain;
  const cut = plain.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ") > 80 ? cut.lastIndexOf(" ") : cut.length)}…`;
}

/** Título y descripción SEO cargados en el admin (sección «SEO» de cada página). */
export function seoOverrides(content: PageContent): { title: string; description: string; image: string } {
  const read = (key: string) => plainTextFromRichHtml(String(getNested(content, key) ?? "")).trim();
  return {
    title: read("seo.title"),
    description: read("seo.description"),
    image: String(getNested(content, "seo.image") ?? "").trim(),
  };
}

type PageSeoInput = {
  /** Ruta pública sin dominio («/propiedades»). */
  path: string;
  /** Título sin el sufijo de marca; se agrega «| Top Rentals». */
  title: string;
  description?: string;
  image?: string;
  /** Forzar noindex (ej. motor de reservas, área de clientes). */
  noindex?: boolean;
  type?: "website" | "article";
};

export async function buildPageMetadata({
  path,
  title,
  description,
  image,
  noindex = false,
  type = "website",
}: PageSeoInput): Promise<Metadata> {
  const cleanTitle = plainTextFromRichHtml(title).trim();
  const fullTitle = cleanTitle && !cleanTitle.includes(SITE_NAME) ? `${cleanTitle} | ${SITE_NAME}` : cleanTitle || SITE_NAME;
  const desc = description ? truncateText(description) : undefined;
  const ogImage = absoluteUrl(image && !image.includes("placeholders") ? image : DEFAULT_OG_IMAGE);
  const indexable = !noindex && (await isIndexableHost());

  return {
    title: { absolute: fullTitle },
    description: desc,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      type,
      url: absoluteUrl(path),
      siteName: SITE_NAME,
      locale: "es_AR",
      title: fullTitle,
      description: desc,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: [ogImage],
    },
    robots: indexable ? { index: true, follow: true } : { index: false, follow: !noindex },
  };
}

/** Script JSON-LD seguro para incrustar en el HTML. */
export function jsonLdScript(data: unknown): { __html: string } {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}

/** Organización + sitio: va en todas las páginas. */
export function organizationJsonLd(social: string[]) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: absoluteUrl("/images/brand/logo-footer.png"),
        description:
          "Departamentos temporarios con servicio de hotel en Buenos Aires y Quito para estadías cortas, corporativas y grupos.",
        areaServed: ["Buenos Aires, Argentina", "Quito, Ecuador"],
        sameAs: social.filter((url) => /^https?:\/\//.test(url)),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        inLanguage: "es",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
