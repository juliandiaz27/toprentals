import type { Metadata } from "next";
import { readPageContent } from "@/lib/pageContent/storage";
import { pickHomeHeader, pickHomeHero } from "@/lib/pageContent/homeTypes";
import { SiteHeader } from "@/components/home/SiteHeader";
import { WhatsAppFab } from "@/components/properties/WhatsAppFab";
import { LoyaltyModule } from "@/components/gnahs/LoyaltyModule";

export const CLUB_LOYALTY_METADATA: Metadata = {
  title: "Club Top Rentals | Top Rentals",
  description: "Programa de fidelización Club Top Rentals",
};

export async function ClubLoyaltyPage() {
  const homeContent = await readPageContent("home");
  const header = pickHomeHeader(homeContent);
  const homeHero = pickHomeHero(homeContent);
  const whatsapp =
    homeHero.whatsappEnabled && homeHero.whatsappUrl
      ? homeHero.whatsappUrl
      : undefined;

  return (
    <>
      <SiteHeader header={header} activeHref="/club-top-rentals" />
      <main className="flex-1 bg-white">
        <div className="mx-auto w-full max-w-[1440px] px-6 py-10 lg:px-12 lg:py-12">
          <header className="mb-8 max-w-3xl" data-reveal>
            <h1 className="text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-tight text-neutral-950">
              Club Top Rentals
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">
              Sumate al programa de fidelización: beneficios, puntos y ventajas
              exclusivas en tus estadías.
            </p>
          </header>
          <div data-reveal data-reveal-delay="80">
            <LoyaltyModule />
          </div>
        </div>
      </main>
      {whatsapp ? <WhatsAppFab url={whatsapp} /> : null}
    </>
  );
}
