import type { Metadata } from "next";
import { readPageContent } from "@/lib/pageContent/storage";
import { pickHomeHeader, pickHomeHero } from "@/lib/pageContent/homeTypes";
import { pickCorporatePage } from "@/lib/pageContent/corporateTypes";
import { pageMetadataTitle } from "@/lib/pageContent/metadata";
import { SiteHeader } from "@/components/home/SiteHeader";
import { CorporateHero } from "@/components/corporate/CorporateHero";
import { CorporateDesignedFor } from "@/components/corporate/CorporateDesignedFor";
import { CorporateFeaturesGrid } from "@/components/corporate/CorporateFeaturesGrid";
import { CorporateBenefits } from "@/components/corporate/CorporateBenefits";
import { CorporateHowItWorks } from "@/components/corporate/CorporateHowItWorks";
import { CorporateSpaces } from "@/components/corporate/CorporateSpaces";
import { CorporateDestinations } from "@/components/corporate/CorporateDestinations";
import { CorporateAccess } from "@/components/corporate/CorporateAccess";
import { WhatsAppFab } from "@/components/properties/WhatsAppFab";
import { getSiteLanguage } from "@/lib/i18nServer";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getSiteLanguage();
  const content = await readPageContent("corporate", language);
  const page = pickCorporatePage(content);
  return { title: pageMetadataTitle(page.hero.title) };
}

export default async function CorporatePage() {
  const language = await getSiteLanguage();
  const [corporateContent, homeContent] = await Promise.all([
    readPageContent("corporate", language),
    readPageContent("home", language),
  ]);
  const header = pickHomeHeader(homeContent);
  const homeHero = pickHomeHero(homeContent);
  const page = pickCorporatePage(corporateContent);
  const whatsapp =
    homeHero.whatsappEnabled && homeHero.whatsappUrl
      ? homeHero.whatsappUrl
      : undefined;

  return (
    <>
      <SiteHeader header={header} variant="muted" activeHref="/corporate" />
      <main className="bg-white">
        <CorporateHero content={page.hero} />
        <CorporateDesignedFor content={page.designedFor} />
        <CorporateFeaturesGrid content={page.features} />
        <CorporateBenefits content={page.benefits} />
        <CorporateHowItWorks content={page.howItWorks} />
        <CorporateSpaces content={page.spaces} />
        <CorporateDestinations content={page.destinations} />
        <CorporateAccess content={page.access} />
      </main>
      {whatsapp ? <WhatsAppFab url={whatsapp} /> : null}
    </>
  );
}
