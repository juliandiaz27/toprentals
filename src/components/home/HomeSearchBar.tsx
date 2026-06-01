import { HomeBookingSearch } from "./HomeBookingSearch";

type Props = {
  bookingRoute?: string;
};

/** Buscador home (Figma): ancho completo, pegado al hero. */
export function HomeSearchBar({ bookingRoute = "/reservas" }: Props) {
  return (
    <section
      id="buscador"
      data-reveal
      className="relative z-30 w-full border-b border-neutral-200 bg-white"
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 py-5 md:px-10 md:py-6">
        <HomeBookingSearch bookingRoute={bookingRoute} />
      </div>
    </section>
  );
}
