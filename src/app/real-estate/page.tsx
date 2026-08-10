import type { Metadata } from "next";
import { readPageContent } from "@/lib/pageContent/storage";
import { pickHomeHeader, pickHomeHero } from "@/lib/pageContent/homeTypes";
import { pickRealEstatePage } from "@/lib/pageContent/realEstateTypes";
import { pageMetadataTitle } from "@/lib/pageContent/metadata";
import { SiteHeader } from "@/components/home/SiteHeader";
import { RealEstateHero } from "@/components/real-estate/RealEstateHero";
import { RealEstateCopySection } from "@/components/real-estate/RealEstateCopySection";
import { RealEstateOperationDiff } from "@/components/real-estate/RealEstateOperationDiff";
import { RealEstateProvenStats } from "@/components/real-estate/RealEstateProvenStats";
import { RealEstateProjects } from "@/components/real-estate/RealEstateProjects";
import { RealEstateCommercialization } from "@/components/real-estate/RealEstateCommercialization";
import { RealEstateIntegratedModel } from "@/components/real-estate/RealEstateIntegratedModel";
import { RealEstateFinalCta } from "@/components/real-estate/RealEstateFinalCta";
import { WhatsAppFab } from "@/components/properties/WhatsAppFab";
import { getSiteLanguage } from "@/lib/i18nServer";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getSiteLanguage();
  const content = await readPageContent("real-estate", language);
  const page = pickRealEstatePage(content);
  return { title: pageMetadataTitle(page.hero.title) };
}

export default async function RealEstatePage() {
  const language = await getSiteLanguage();
  const [reContent, homeContent] = await Promise.all([
    readPageContent("real-estate", language),
    readPageContent("home", language),
  ]);
  const header = pickHomeHeader(homeContent);
  const homeHero = pickHomeHero(homeContent);
  const page = pickRealEstatePage(reContent);
  const whatsapp =
    homeHero.whatsappEnabled && homeHero.whatsappUrl
      ? homeHero.whatsappUrl
      : undefined;

  return (
    <>
      <SiteHeader header={header} activeHref="/real-estate" />
      <main className="bg-white">
        <RealEstateHero content={page.hero} />
        <RealEstateCopySection content={page.development} variant="light" />
        <RealEstateCopySection
          content={page.rentIncluded}
          variant="light-separated"
        />
        <RealEstateOperationDiff content={page.operationDiff} />
        <RealEstateProvenStats content={page.proven} />
        <RealEstateProjects
          title={page.opportunitiesTitle}
          subtitle={page.opportunitiesSubtitle}
          closing={page.opportunitiesClosing}
          projects={page.projects}
        />
        <RealEstateCommercialization content={page.commercialization} />
        <RealEstateIntegratedModel content={page.integratedModel} />
        <RealEstateFinalCta content={page.finalCta} />
      </main>
      {whatsapp ? <WhatsAppFab url={whatsapp} /> : null}
    </>
  );
}
