import {
  buildReservasMetadata,
  ReservasEnginePage,
} from "@/components/gnahs/ReservasEnginePage";
import { parseGnahsEstablishmentId } from "@/lib/gnahs/buildBookingUrl";

export const dynamic = "force-dynamic";

export const metadata = buildReservasMetadata({
  title: "Reservas Quito | Top Rentals",
  description: "Reservá departamentos temporarios en Quito, Ecuador.",
});

type PageProps = {
  searchParams: Promise<{ establishment_id?: string | string[] }>;
};

export default async function ReservasQuitoPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const establishmentId = parseGnahsEstablishmentId(sp.establishment_id);

  return (
    <ReservasEnginePage
      region="quito"
      title="Reservas — Quito"
      description="Alojamiento temporal en Quito, Ecuador."
      establishmentId={establishmentId}
    />
  );
}
