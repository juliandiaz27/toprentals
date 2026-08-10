import type { Metadata } from "next";
import { ClubBenefits } from "@/components/club/ClubBenefits";
import { ClubFaq } from "@/components/club/ClubFaq";
import { ClubHero } from "@/components/club/ClubHero";
import { ClubHowItWorks } from "@/components/club/ClubHowItWorks";
import { ClubIntro } from "@/components/club/ClubIntro";
import { ClubLevels } from "@/components/club/ClubLevels";
import { ClubPropertiesStrip } from "@/components/club/ClubPropertiesStrip";
import { SiteHeader } from "@/components/home/SiteHeader";
import { WhatsAppFab } from "@/components/properties/WhatsAppFab";
import { loadPropertyListings } from "@/lib/properties/catalog";
import { pickClubPage } from "@/lib/pageContent/clubTypes";
import { pickHomeHeader, pickHomeHero } from "@/lib/pageContent/homeTypes";
import { readPageContent } from "@/lib/pageContent/storage";
import { getSiteLanguage } from "@/lib/i18nServer";

export const CLUB_LOYALTY_METADATA: Metadata = {
  title: "Club Top Rentals | Top Rentals",
  description:
    "Programa de fidelización Club Top Rentals: puntos, niveles y beneficios en cada estadía.",
};

export async function ClubLoyaltyPage() {
  const language = await getSiteLanguage();
  const [clubContent, homeContent, listings] = await Promise.all([
    readPageContent("club", language),
    readPageContent("home", language),
    loadPropertyListings(),
  ]);
  const page = pickClubPage(clubContent);
  const header = pickHomeHeader(homeContent);
  const homeHero = pickHomeHero(homeContent);
  const whatsapp =
    homeHero.whatsappEnabled && homeHero.whatsappUrl
      ? homeHero.whatsappUrl
      : undefined;

  return (
    <>
      <SiteHeader header={header} activeHref="/club-top-rentals" />
      <main className="bg-white">
        <ClubHero content={page.hero} />
        <ClubIntro content={page.intro} />
        <ClubHowItWorks title={page.howItWorks.title} steps={page.howItWorks.steps} />
        <ClubLevels
          title={page.levels.title}
          subtitle={page.levels.subtitle}
          tiers={page.levels.tiers}
        />
        <ClubBenefits title={page.benefits.title} columns={page.benefits.columns} />
        <ClubFaq title={page.faq.title} items={page.faq.items} />
        <ClubPropertiesStrip
          content={page.featured}
          bottomCta={page.bottomCta}
          properties={listings}
        />
      </main>
      {whatsapp ? <WhatsAppFab url={whatsapp} /> : null}
    </>
  );
}
