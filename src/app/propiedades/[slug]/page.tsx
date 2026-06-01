import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { readPageContent } from "@/lib/pageContent/storage";
import { pickHomeHeader, pickHomeHero } from "@/lib/pageContent/homeTypes";
import { getPropertyBySlug } from "@/lib/properties/catalog";
import { getPropertyDetail } from "@/lib/properties/details";
import { SiteHeader } from "@/components/home/SiteHeader";
import { PropertyDetailView } from "@/components/properties/detail/PropertyDetailView";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);
  if (!property) return { title: "Propiedad | Top Rentals" };
  return { title: `${property.name} | Top Rentals` };
}

export default async function PropiedadDetallePage({ params }: Props) {
  const { slug } = await params;
  const property = getPropertyDetail(slug);
  if (!property) notFound();

  const homeContent = await readPageContent("home");
  const header = pickHomeHeader(homeContent);
  const homeHero = pickHomeHero(homeContent);
  const whatsapp =
    homeHero.whatsappEnabled && homeHero.whatsappUrl ? homeHero.whatsappUrl : undefined;

  return (
    <>
      <SiteHeader header={header} />
      <PropertyDetailView property={property} whatsappUrl={whatsapp} />
    </>
  );
}
