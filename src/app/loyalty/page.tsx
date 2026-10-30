import { LoyaltyAccessPage } from "@/components/gnahs/LoyaltyAccessPage";
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return buildPageMetadata({
    path: "/loyalty",
    title: "Acceso Club Top Rentals",
    description: "Ingresá al Club Top Rentals para sumar puntos y canjear beneficios.",
    noindex: true,
  });
}

export default function LoyaltyPage() {
  return <LoyaltyAccessPage />;
}
