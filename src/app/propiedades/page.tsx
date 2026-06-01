import type { Metadata } from "next";
import { readPageContent } from "@/lib/pageContent/storage";
import {
  pickPropiedadesDevelopment,
  pickPropiedadesFilters,
  pickPropiedadesHero,
} from "@/lib/pageContent/propiedadesTypes";
import { pickHomeHeader, pickHomeHero } from "@/lib/pageContent/homeTypes";
import { getGnahsWidgetConfig } from "@/lib/gnahs/config";
import { SiteHeader } from "@/components/home/SiteHeader";
import { PropertiesSearchBar } from "@/components/properties/PropertiesSearchBar";
import { PropertiesGrid } from "@/components/properties/PropertiesGrid";
import { PropertiesDevelopment } from "@/components/properties/PropertiesDevelopment";
import { WhatsAppFab } from "@/components/properties/WhatsAppFab";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await readPageContent("propiedades");
  const hero = pickPropiedadesHero(content);
  return { title: `${hero.title} | Top Rentals` };
}

export default async function PropiedadesPage() {
  const [propContent, homeContent] = await Promise.all([
    readPageContent("propiedades"),
    readPageContent("home"),
  ]);
  const header = pickHomeHeader(homeContent);
  const homeHero = pickHomeHero(homeContent);
  const hero = pickPropiedadesHero(propContent);
  const filters = pickPropiedadesFilters(propContent);
  const development = pickPropiedadesDevelopment(propContent);
  const gnahsWidget = getGnahsWidgetConfig();

  return (
    <>
      <SiteHeader header={header} />
      <main className="bg-white">
        <div
          data-reveal
          className="mx-auto w-full max-w-[1440px] px-6 pt-10 pb-0 lg:px-12 lg:pt-14"
        >
          <header className="max-w-3xl">
            <h1 className="text-[clamp(2rem,4vw,2.75rem)] font-bold leading-tight tracking-tight text-neutral-950">
              {hero.title}
            </h1>
            {hero.subtitle ? (
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-600 lg:text-lg">
                {hero.subtitle}
              </p>
            ) : null}
          </header>
        </div>

        <div className="mt-10">
          <PropertiesSearchBar config={gnahsWidget} />
        </div>

        <PropertiesGrid filterLabels={filters} />

        <PropertiesDevelopment content={development} />
      </main>
      {homeHero.whatsappEnabled && homeHero.whatsappUrl ? (
        <WhatsAppFab url={homeHero.whatsappUrl} />
      ) : null}
    </>
  );
}
