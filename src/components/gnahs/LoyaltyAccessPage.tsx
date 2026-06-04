import type { Metadata } from "next";
import { LoyaltyModule } from "@/components/gnahs/LoyaltyModule";
import { SiteHeader } from "@/components/home/SiteHeader";
import { WhatsAppFab } from "@/components/properties/WhatsAppFab";
import { pickHomeHeader, pickHomeHero } from "@/lib/pageContent/homeTypes";
import { readPageContent } from "@/lib/pageContent/storage";

export const LOYALTY_PAGE_METADATA: Metadata = {
  title: "Acceso Club Top Rentals | Top Rentals",
  description:
    "Unite al Club Top Rentals o ingresá con tu cuenta para sumar puntos y canjear beneficios.",
};

export async function LoyaltyAccessPage() {
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
          <LoyaltyModule />
        </div>
      </main>
      {whatsapp ? <WhatsAppFab url={whatsapp} /> : null}
    </>
  );
}
