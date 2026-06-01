import Link from "next/link";

type Props = {
  bookingRoute: string;
  message?: string;
};

export function BookingWidgetFallback({
  bookingRoute,
  message = "Buscador no disponible en este entorno. Podés reservar desde el motor.",
}: Props) {
  return (
    <div className="py-2 text-center" role="status">
      <p className="text-sm text-neutral-600">{message}</p>
      <Link
        href={bookingRoute}
        className="mt-3 inline-flex h-11 items-center justify-center rounded-lg bg-neutral-900 px-6 text-sm font-medium text-white transition hover:bg-neutral-800"
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
