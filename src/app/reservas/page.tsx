import {
  buildReservasMetadata,
  ReservasEnginePage,
} from "@/components/gnahs/ReservasEnginePage";

export const metadata = buildReservasMetadata({
  title: "Reservas | Top Rentals",
  description: "Reservá en todas nuestras torres — Buenos Aires y Quito.",
});

export default function ReservasPage() {
  return (
    <ReservasEnginePage
      region="all"
      title="Reservas"
      description="Motor de reservas con todos los establecimientos Top Rentals."
    />
  );
}
