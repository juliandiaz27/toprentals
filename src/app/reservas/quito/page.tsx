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
    path: "/reservas/quito",
    title: "Reservas Quito",
    description: "Reservá departamentos temporarios en Quito, Ecuador.",
    noindex: true,
  });
}

type PageProps = {
  searchParams: Promise<{
    establishment_id?: string | string[];
    lang?: string | string[];
  }>;
};

export default async function ReservasQuitoPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const establishmentId = parseGnahsEstablishmentId(sp.establishment_id);
  const language = await getSiteLanguage(sp.lang);

  return (
    <ReservasEnginePage
      region="quito"
      title="Reservas — Quito"
      description="Alojamiento temporal en Quito, Ecuador."
      establishmentId={establishmentId}
      language={language}
    />
  );
}
