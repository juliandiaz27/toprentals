import { readPageContent } from "@/lib/pageContent/storage";
import {
  pickHomeHeader,
  pickHomeHero,
  pickHomeHeroSlides,
  pickHomeBuildings,
  pickHomeCorporateTeaser,
  pickHomeDirectBenefits,
  pickHomeLocations,
  pickHomeInvestorCta,
  pickHomeStats,
  pickHomeDifferentials,
  pickHomeFeatured,
} from "@/lib/pageContent/homeTypes";
import { HomeAnimatedStats } from "@/components/home/HomeAnimatedStats";
import { HomeBelowSearchSection } from "@/components/home/HomeBelowSearchSection";
import { getGnahsWidgetConfig } from "@/lib/gnahs/config";
import { SiteHeader } from "@/components/home/SiteHeader";
import { HeroBanner } from "@/components/home/HeroBanner";
import { BuildingsTourSection } from "@/components/home/BuildingsTourSection";
import { CorporateTeaserSection } from "@/components/home/CorporateTeaserSection";
import { DirectBenefitsSection } from "@/components/home/DirectBenefitsSection";
import { LocationsSection } from "@/components/home/LocationsSection";
import { InvestorCtaSection } from "@/components/home/InvestorCtaSection";
import { HomeSearchBar } from "@/components/home/HomeSearchBar";
import { WhatsAppFab } from "@/components/properties/WhatsAppFab";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await readPageContent("home");
  const header = pickHomeHeader(content);
  const hero = pickHomeHero(content);
  const slides = pickHomeHeroSlides(content, hero);
  const gnahsWidget = getGnahsWidgetConfig();
  const buildings = pickHomeBuildings(content);
  const corporateTeaser = pickHomeCorporateTeaser(content);
  const directBenefits = pickHomeDirectBenefits(content);
  const locations = pickHomeLocations(content);
  const investorCta = pickHomeInvestorCta(content);
  const stats = pickHomeStats(content);
  const differentials = pickHomeDifferentials(content);
  const featured = pickHomeFeatured(content);

  return (
    <>
      <SiteHeader header={header} />
      <main>
        <HeroBanner hero={hero} slides={slides} />

        <HomeSearchBar bookingRoute={gnahsWidget.bookingRoute} />

        <HomeAnimatedStats items={stats.items} />

        <HomeBelowSearchSection
          differentials={differentials}
          featured={featured}
        />

        <div className="bg-black">
          <BuildingsTourSection content={buildings} />
        </div>
        <CorporateTeaserSection content={corporateTeaser} />
        <DirectBenefitsSection content={directBenefits} />
        <LocationsSection content={locations} />
        <InvestorCtaSection content={investorCta} />
      </main>
      {hero.whatsappEnabled && hero.whatsappUrl ? (
        <WhatsAppFab url={hero.whatsappUrl} />
      ) : null}
    </>
  );
}
