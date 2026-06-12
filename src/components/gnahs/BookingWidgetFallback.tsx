import Link from "next/link";
import { HomeBookingSearch } from "@/components/home/HomeBookingSearch";
import type { PropertyListing } from "@/lib/properties/catalog";
import { reservasLinkProps } from "@/lib/reservasLink";

type Props = {
  bookingRoute: string;
  message?: string;
  listings?: PropertyListing[];
  /** Misma UI que Figma; redirige al motor con params GNAHS (sin API widget). */
  useCustomSearch?: boolean;
  initialEstablishmentId?: number;
  establishmentLabel?: string;
};

export function BookingWidgetFallback({
  bookingRoute,
  message,
  listings = [],
  useCustomSearch = false,
  initialEstablishmentId,
  establishmentLabel,
}: Props) {
  if (useCustomSearch) {
    return (
      <div role="status">
        {message ? (
          <p className="mb-4 text-center text-[13px] text-neutral-500">{message}</p>
        ) : null}
        <HomeBookingSearch
          listings={listings}
          bookingRoute={bookingRoute}
          initialEstablishmentId={initialEstablishmentId}
          lockEstablishment={initialEstablishmentId != null}
          establishmentLabel={establishmentLabel}
        />
      </div>
    );
  }

  return (
    <div className="py-2 text-center" role="status">
      <p className="text-sm text-neutral-600">
        {message ??
          "Buscador no disponible en este entorno. Podés reservar desde el motor."}
      </p>
      <Link
        href={bookingRoute}
        {...reservasLinkProps(bookingRoute)}
        className="mt-3 inline-flex h-11 items-center justify-center rounded-lg bg-btn px-6 text-sm font-medium text-white transition hover:bg-btn-hover"
      >
        Ir al motor de reservas
      </Link>
    </div>
  );
}

export function BookingWidgetSkeleton() {
  return (
    <div
      className="min-h-[52px] w-full animate-pulse rounded-md bg-neutral-100"
      aria-hidden
    />
  );
}
