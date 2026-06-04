import type { Metadata } from "next";
import { readPageContent } from "@/lib/pageContent/storage";
import { pickHomeHeader, pickHomeHero } from "@/lib/pageContent/homeTypes";
import { pickTrabajaPage } from "@/lib/pageContent/trabajaTypes";
import { SiteHeader } from "@/components/home/SiteHeader";
import { CareersHero } from "@/components/trabaja/CareersHero";
import { CareersWhy } from "@/components/trabaja/CareersWhy";
import { CareersSpontaneousForm } from "@/components/trabaja/CareersSpontaneousForm";
import { WhatsAppFab } from "@/components/properties/WhatsAppFab";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await readPageContent("trabaja");
  const page = pickTrabajaPage(content);
  return {
    title: `${page.hero.title} | Top Rentals`,
    description: page.hero.subtitle,
  };
}

export default async function TrabajaConNosotrosPage() {
  const [trabajaContent, homeContent] = await Promise.all([
    readPageContent("trabaja"),
    readPageContent("home"),
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
