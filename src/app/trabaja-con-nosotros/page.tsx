import type { Metadata } from "next";
import { readPageContent } from "@/lib/pageContent/storage";
import { pickHomeHeader, pickHomeHero } from "@/lib/pageContent/homeTypes";
import { pickTrabajaPage } from "@/lib/pageContent/trabajaTypes";
import {
  pageMetadataDescription,
  pageMetadataTitle,
} from "@/lib/pageContent/metadata";
import { SiteHeader } from "@/components/home/SiteHeader";
import { CareersHero } from "@/components/trabaja/CareersHero";
import { CareersWhy } from "@/components/trabaja/CareersWhy";
import { CareersSpontaneousForm } from "@/components/trabaja/CareersSpontaneousForm";
import { WhatsAppFab } from "@/components/properties/WhatsAppFab";
import { getSiteLanguage } from "@/lib/i18nServer";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getSiteLanguage();
  const content = await readPageContent("trabaja", language);
  const page = pickTrabajaPage(content);
  return {
    title: pageMetadataTitle(page.hero.title),
    description: pageMetadataDescription(page.hero.subtitle),
  };
}

export default async function TrabajaConNosotrosPage() {
  const language = await getSiteLanguage();
  const [trabajaContent, homeContent] = await Promise.all([
    readPageContent("trabaja", language),
    readPageContent("home", language),
  ]);
  const header = pickHomeHeader(homeContent);
  const homeHero = pickHomeHero(homeContent);
  const page = pickTrabajaPage(trabajaContent);
  const whatsapp =
    homeHero.whatsappEnabled && homeHero.whatsappUrl
      ? homeHero.whatsappUrl
      : undefined;

  return (
    <>
      <SiteHeader
        header={header}
        activeHref="/trabaja-con-nosotros"
      />
      <main className="bg-white">
        <CareersHero content={page.hero} />
        <CareersWhy content={page.why} />
        <CareersSpontaneousForm content={page.spontaneous} />
      </main>
      {whatsapp ? <WhatsAppFab url={whatsapp} /> : null}
    </>
  );
}
