import type { Metadata } from "next";
import { readPageContent } from "@/lib/pageContent/storage";
import {
  pickPropiedadesDevelopment,
  pickPropiedadesFilters,
  pickPropiedadesHero,
} from "@/lib/pageContent/propiedadesTypes";
import { pickHomeHeader, pickHomeHero } from "@/lib/pageContent/homeTypes";
import { loadPropertyListings } from "@/lib/properties/catalog";
import { getSiteLanguage } from "@/lib/i18nServer";
import { SiteHeader } from "@/components/home/SiteHeader";
import { PropertiesGrid } from "@/components/properties/PropertiesGrid";
import { PropertiesDevelopment } from "@/components/properties/PropertiesDevelopment";
import { WhatsAppFab } from "@/components/properties/WhatsAppFab";
import { pageMetadataTitle } from "@/lib/pageContent/metadata";
import { buildPageMetadata, seoOverrides } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getSiteLanguage();
  const content = await readPageContent("propiedades", language);
  const hero = pickPropiedadesHero(content);
  const seo = seoOverrides(content);
  return buildPageMetadata({
    path: "/propiedades",
    title: seo.title || hero.title,
    description: seo.description || "Departamentos temporarios con servicio de hotel en Buenos Aires y Quito: studios, 2 y 3 ambientes en Palermo, Núñez, Belgrano, Microcentro y más.",
    image: seo.image,
  });
}

export default async function PropiedadesPage() {
  const language = await getSiteLanguage();
  const [propContent, homeContent, listings] = await Promise.all([
    readPageContent("propiedades", language),
    readPageContent("home", language),
    loadPropertyListings({ language }),
  ]);
  const header = pickHomeHeader(homeContent);
  const homeHero = pickHomeHero(homeContent);
  const hero = pickPropiedadesHero(propContent);
  const filters = pickPropiedadesFilters(propContent);
  const development = pickPropiedadesDevelopment(propContent);

  return (
    <>
      <SiteHeader header={header} variant="green" />
      <main className="bg-white">
        <PropertiesGrid hero={hero} filters={filters} listings={listings} />

        <PropertiesDevelopment content={development} />
      </main>
      {homeHero.whatsappEnabled && homeHero.whatsappUrl ? (
        <WhatsAppFab url={homeHero.whatsappUrl} />
      ) : null}
    </>
  );
}
