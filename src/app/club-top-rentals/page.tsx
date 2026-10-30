import type { Metadata } from "next";
import { ClubLoyaltyPage } from "@/components/gnahs/ClubLoyaltyPage";
import { readPageContent } from "@/lib/pageContent/storage";
import { getSiteLanguage } from "@/lib/i18nServer";
import { buildPageMetadata, seoOverrides } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await readPageContent("club", await getSiteLanguage());
  const seo = seoOverrides(content);
  return buildPageMetadata({
    path: "/club-top-rentals",
    title: seo.title || "Club Top Rentals",
    description:
      seo.description ||
      "Club Top Rentals: sumá puntos en cada estadía y accedé a upgrades, late check-out y descuentos de hasta 30% en tus reservas.",
    image: seo.image,
  });
}

export default function ClubTopRentalsPage() {
  return <ClubLoyaltyPage />;
}
