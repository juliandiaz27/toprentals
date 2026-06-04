import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { readPageContent } from "@/lib/pageContent/storage";
import { pickHomeHeader, pickHomeHero } from "@/lib/pageContent/homeTypes";
import { loadPropertyListings } from "@/lib/properties/catalog";
import { getPropertyDetail, getRelatedProperties } from "@/lib/properties/details";
import { getVisibleReviewsForProperty } from "@/lib/properties/reviews";
import { SiteHeader } from "@/components/home/SiteHeader";
import { PropertyDetailView } from "@/components/properties/detail/PropertyDetailView";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const listings = await loadPropertyListings();
  const property = listings.find((p) => p.slug === slug && !p.comingSoon);
  if (!property) return { title: "Propiedad | Top Rentals" };
  return { title: `${property.name} | Top Rentals` };
}

export default async function PropiedadDetallePage({ params }: Props) {
  const { slug } = await params;
  const [property, listings, homeContent, reviews] = await Promise.all([
    getPropertyDetail(slug),
    loadPropertyListings(),
    readPageContent("home"),
    getVisibleReviewsForProperty(slug),
  ]);
  if (!property) notFound();

  const related = getRelatedProperties(
    listings,
    property.relatedSlugs,
    property.slug,
  );
  const header = pickHomeHeader(homeContent);
  const homeHero = pickHomeHero(homeContent);
  const whatsapp =
    homeHero.whatsappEnabled && homeHero.whatsappUrl ? homeHero.whatsappUrl : undefined;

  return (
    <>
      <SiteHeader header={header} />
      <PropertyDetailView
        property={property}
        related={related}
        reviews={reviews}
        whatsappUrl={whatsapp}
      />
    </>
  );
}
