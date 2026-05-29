import { readPageContent } from "@/lib/pageContent/storage";
import {
  pickHomeHeader,
  pickHomeHero,
  pickHomeHeroSlides,
} from "@/lib/pageContent/homeTypes";
import { getGnahsWidgetConfig } from "@/lib/gnahs/config";
import { SiteHeader } from "@/components/home/SiteHeader";
import { HeroBanner } from "@/components/home/HeroBanner";
import { BookingWidget } from "@/components/gnahs/BookingWidget";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await readPageContent("home");
  const header = pickHomeHeader(content);
  const hero = pickHomeHero(content);
  const slides = pickHomeHeroSlides(content, hero);
  const gnahsWidget = getGnahsWidgetConfig();

  return (
    <>
      <SiteHeader header={header} />
      <main>
        <HeroBanner hero={hero} slides={slides} />
        {/* Buscador GNAHS — próximo paso */}
        <section
          id="buscador"
          className="relative z-20 -mt-14 mx-auto w-full max-w-[1100px] px-4 lg:px-8"
        >
          <div className="rounded-sm bg-white px-4 py-3 shadow-[0_8px_40px_rgba(0,0,0,0.15)] md:px-6 md:py-4">
            <BookingWidget config={gnahsWidget} />
          </div>
        </section>
      </main>
    </>
  );
}
