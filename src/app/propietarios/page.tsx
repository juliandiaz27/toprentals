import type { Metadata } from "next";
import { readPageContent } from "@/lib/pageContent/storage";
import { pickHomeHeader, pickHomeHero } from "@/lib/pageContent/homeTypes";
import { pickPropietariosPage } from "@/lib/pageContent/propietariosTypes";
import {
  pageMetadataDescription,
  pageMetadataTitle,
} from "@/lib/pageContent/metadata";
import { SiteHeader } from "@/components/home/SiteHeader";
import { PropietariosHero } from "@/components/propietarios/PropietariosHero";
import { PropietariosBenefits } from "@/components/propietarios/PropietariosBenefits";
import { PropietariosProtectedRent } from "@/components/propietarios/PropietariosProtectedRent";
import { PropietariosHowItWorks } from "@/components/propietarios/PropietariosHowItWorks";
import { PropietariosEquipment } from "@/components/propietarios/PropietariosEquipment";
import { PropietariosExperience } from "@/components/propietarios/PropietariosExperience";
import { PropietariosFinalCta } from "@/components/propietarios/PropietariosFinalCta";
import { WhatsAppFab } from "@/components/properties/WhatsAppFab";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await readPageContent("propietarios");
  const page = pickPropietariosPage(content);
  return {
    title: pageMetadataTitle("Propietarios"),
    description: pageMetadataDescription(page.hero.subtitle),
  };
}

export default async function PropietariosPage() {
  const [propietariosContent, homeContent] = await Promise.all([
    readPageContent("propietarios"),
    readPageContent("home"),
  ]);
  const header = pickHomeHeader(homeContent);
  const homeHero = pickHomeHero(homeContent);
  const page = pickPropietariosPage(propietariosContent);
  const whatsapp =
    homeHero.whatsappEnabled && homeHero.whatsappUrl
      ? homeHero.whatsappUrl
      : undefined;

  return (
    <>
      <SiteHeader header={header} variant="muted" activeHref="/propietarios" />
      <main className="bg-white">
        <PropietariosHero content={page.hero} />
        <PropietariosBenefits content={page.benefits} />
        <PropietariosProtectedRent content={page.protectedRent} />
        <PropietariosHowItWorks content={page.howItWorks} />
        <PropietariosEquipment content={page.equipment} />
        <PropietariosExperience content={page.experience} />
        <PropietariosFinalCta content={page.finalCta} />
      </main>
      {whatsapp ? <WhatsAppFab url={whatsapp} /> : null}
    </>
  );
}
