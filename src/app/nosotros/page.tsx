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

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await readPageContent("nosotros");
  const page = pickNosotrosPage(content);
  return { title: pageMetadataTitle(page.hero.title) };
}

export default async function NosotrosPage() {
  const [nosotrosContent, homeContent] = await Promise.all([
    readPageContent("nosotros"),
    readPageContent("home"),
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
