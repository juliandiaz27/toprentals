import {
  buildReservasMetadata,
  ReservasEnginePage,
} from "@/components/gnahs/ReservasEnginePage";
import { parseGnahsEstablishmentId } from "@/lib/gnahs/buildBookingUrl";

export const dynamic = "force-dynamic";

export const metadata = buildReservasMetadata({
  title: "Reservas | Top Rentals",
  description: "Reservá en todas nuestras torres — Buenos Aires y Quito.",
});

type PageProps = {
  searchParams: Promise<{ establishment_id?: string | string[] }>;
};

export default async function ReservasPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const establishmentId = parseGnahsEstablishmentId(sp.establishment_id);

  return (
    <ReservasEnginePage
      region="all"
      title="Reservas"
      description="Motor de reservas con todos los establecimientos Top Rentals."
      establishmentId={establishmentId}
    />
  );
}
