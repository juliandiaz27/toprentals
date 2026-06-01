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
} from "@/lib/pageContent/homeTypes";
import { getGnahsWidgetConfig } from "@/lib/gnahs/config";
import { SiteHeader } from "@/components/home/SiteHeader";
import { HeroBanner } from "@/components/home/HeroBanner";
import { BuildingsTourSection } from "@/components/home/BuildingsTourSection";
import { CorporateTeaserSection } from "@/components/home/CorporateTeaserSection";
import { DirectBenefitsSection } from "@/components/home/DirectBenefitsSection";
import { LocationsSection } from "@/components/home/LocationsSection";
import { InvestorCtaSection } from "@/components/home/InvestorCtaSection";
import { BookingWidget } from "@/components/gnahs/BookingWidgetDynamic";

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

  return (
    <>
      <SiteHeader header={header} />
      <main>
        <HeroBanner hero={hero} slides={slides} />
        {/* Buscador GNAHS — próximo paso */}
        <div className="bg-black">
          <section
            id="buscador"
            className="relative z-20 -mt-16 mx-auto w-full max-w-[1100px] px-4 pb-8 lg:-mt-20 lg:px-8"
          >
            <div className="rounded-sm bg-white px-4 py-3 shadow-[0_8px_40px_rgba(0,0,0,0.15)] md:px-6 md:py-4 [&_.gnahs-booking-widget]:min-h-0">
              <BookingWidget config={gnahsWidget} />
            </div>
          </section>
          <BuildingsTourSection content={buildings} />
        </div>
        <CorporateTeaserSection content={corporateTeaser} />
        <DirectBenefitsSection content={directBenefits} />
        <LocationsSection content={locations} />
        <InvestorCtaSection content={investorCta} />
      </main>
    </>
  );
}
