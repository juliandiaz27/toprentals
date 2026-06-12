import {
  buildReservasMetadata,
  ReservasEnginePage,
} from "@/components/gnahs/ReservasEnginePage";
import { parseGnahsEstablishmentId } from "@/lib/gnahs/buildBookingUrl";

export const dynamic = "force-dynamic";

export const metadata = buildReservasMetadata({
  title: "Reservas Buenos Aires | Top Rentals",
  description: "Reservá departamentos temporarios en Buenos Aires.",
});

type PageProps = {
  searchParams: Promise<{ establishment_id?: string | string[] }>;
};

export default async function ReservasBuenosAiresPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const establishmentId = parseGnahsEstablishmentId(sp.establishment_id);

  return (
    <ReservasEnginePage
      region="buenos-aires"
      title="Reservas — Buenos Aires"
      description="Torres en Palermo, Belgrano, Nuñez, Microcentro y más."
      establishmentId={establishmentId}
    />
  );
}
