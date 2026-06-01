import {
  buildReservasMetadata,
  ReservasEnginePage,
} from "@/components/gnahs/ReservasEnginePage";

export const metadata = buildReservasMetadata({
  title: "Reservas Buenos Aires | Top Rentals",
  description: "Reservá departamentos temporarios en Buenos Aires.",
});

export default function ReservasBuenosAiresPage() {
  return (
    <ReservasEnginePage
      region="buenos-aires"
      title="Reservas — Buenos Aires"
      description="Torres en Palermo, Belgrano, Nuñez, Microcentro y más."
    />
  );
}
