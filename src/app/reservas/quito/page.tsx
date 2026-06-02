import {
  buildReservasMetadata,
  ReservasEnginePage,
} from "@/components/gnahs/ReservasEnginePage";

export const dynamic = "force-dynamic";

export const metadata = buildReservasMetadata({
  title: "Reservas Quito | Top Rentals",
  description: "Reservá departamentos temporarios en Quito, Ecuador.",
});

export default function ReservasQuitoPage() {
  return (
    <ReservasEnginePage
      region="quito"
      title="Reservas — Quito"
      description="Alojamiento temporal en Quito, Ecuador."
    />
  );
}
