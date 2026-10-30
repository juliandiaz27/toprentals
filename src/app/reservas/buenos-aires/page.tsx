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
    path: "/reservas/buenos-aires",
    title: "Reservas Buenos Aires",
    description: "Reservá departamentos temporarios en Buenos Aires.",
    noindex: true,
  });
}

type PageProps = {
  searchParams: Promise<{
    establishment_id?: string | string[];
    lang?: string | string[];
  }>;
};

export default async function ReservasBuenosAiresPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const establishmentId = parseGnahsEstablishmentId(sp.establishment_id);
  const language = await getSiteLanguage(sp.lang);

  return (
    <ReservasEnginePage
      region="buenos-aires"
      title="Reservas — Buenos Aires"
      description="Torres en Palermo, Belgrano, Nuñez, Microcentro y más."
      establishmentId={establishmentId}
      language={language}
    />
  );
}
