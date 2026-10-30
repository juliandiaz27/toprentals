import type { Metadata } from "next";
import { readPageContent } from "@/lib/pageContent/storage";
import { pickHomeHeader, pickHomeHero } from "@/lib/pageContent/homeTypes";
import { pickNosotrosPage } from "@/lib/pageContent/nosotrosTypes";
import { pageMetadataTitle } from "@/lib/pageContent/metadata";
import { SiteHeader } from "@/components/home/SiteHeader";
import { NosotrosHero } from "@/components/nosotros/NosotrosHero";
import { NosotrosHistory } from "@/components/nosotros/NosotrosHistory";
import { NosotrosValues } from "@/components/nosotros/NosotrosValues";
import { WhatsAppFab } from "@/components/properties/WhatsAppFab";
import { getSiteLanguage } from "@/lib/i18nServer";
import { buildPageMetadata, seoOverrides } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getSiteLanguage();
  const content = await readPageContent("nosotros", language);
  const page = pickNosotrosPage(content);
  const seo = seoOverrides(content);
  return buildPageMetadata({
    path: "/nosotros",
    title: seo.title || page.hero.title,
    description: seo.description || "Conocé Top Rentals: operamos edificios completos de departamentos temporarios con servicio de hotel en Buenos Aires y Quito.",
    image: seo.image,
  });
}

export default async function NosotrosPage() {
  const language = await getSiteLanguage();
  const [nosotrosContent, homeContent] = await Promise.all([
    readPageContent("nosotros", language),
    readPageContent("home", language),
  ]);
  const header = pickHomeHeader(homeContent);
  const homeHero = pickHomeHero(homeContent);
  const page = pickNosotrosPage(nosotrosContent);
  const whatsapp =
    homeHero.whatsappEnabled && homeHero.whatsappUrl
      ? homeHero.whatsappUrl
      : undefined;

  return (
    <>
      <SiteHeader header={header} variant="muted" activeHref="/nosotros" />
      <main>
        <NosotrosHero content={page.hero} />
        <NosotrosHistory content={page.history} />
        <NosotrosValues content={page.values} />
      </main>
      {whatsapp ? <WhatsAppFab url={whatsapp} /> : null}
    </>
  );
}
