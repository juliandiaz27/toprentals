import {
  buildReservasMetadata,
  ReservasEnginePage,
} from "@/components/gnahs/ReservasEnginePage";
import { parseGnahsEstablishmentId } from "@/lib/gnahs/buildBookingUrl";
import { getSiteLanguage } from "@/lib/i18nServer";
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return buildPageMetadata({
    path: "/reservas",
    title: "Reservas",
    description: "Reservá en todas nuestras torres — Buenos Aires y Quito.",
    noindex: true,
  });
}

type PageProps = {
  searchParams: Promise<{
    establishment_id?: string | string[];
    lang?: string | string[];
  }>;
};

export default async function ReservasPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const establishmentId = parseGnahsEstablishmentId(sp.establishment_id);
  const language = await getSiteLanguage(sp.lang);

  return (
    <ReservasEnginePage
      region="all"
      title="Reservas"
      description="Motor de reservas con todos los establecimientos Top Rentals."
      establishmentId={establishmentId}
      language={language}
    />
  );
}
