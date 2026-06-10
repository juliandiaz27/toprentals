import {
  GNAHS_FETCH_SCRIPT,
  GNAHS_RHO_INIT_SCRIPT,
} from "@/lib/gnahs/config";

/** Precarga scripts del motor solo en rutas /reservas. */
export default function ReservasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <link rel="preload" href={GNAHS_RHO_INIT_SCRIPT} as="script" />
      <link rel="preload" href={GNAHS_FETCH_SCRIPT} as="script" />
      {children}
    </>
  );
}
