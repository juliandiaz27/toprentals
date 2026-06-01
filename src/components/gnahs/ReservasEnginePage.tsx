import type { Metadata } from "next";
import { BookingEngine } from "@/components/gnahs/BookingEngine";
import {
  getGnahsEngineConfig,
  type GnahsEngineRegion,
} from "@/lib/gnahs/config";

type Props = {
  region: GnahsEngineRegion;
  title: string;
  description: string;
};

export function buildReservasMetadata({
  title,
  description,
}: Pick<Props, "title" | "description">): Metadata {
  return { title, description };
}

function BookingParamsScript({ region }: { region: GnahsEngineRegion }) {
  const params = getGnahsEngineConfig(region);
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.BookingParams = ${JSON.stringify(params)};`,
      }}
    />
  );
}

export function ReservasEnginePage({ region, title, description }: Props) {
  return (
    <main data-reveal className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-neutral-950">{title}</h1>
        <p className="mt-2 text-sm text-neutral-600">{description}</p>
      </header>
      <BookingParamsScript region={region} />
      <div
        id="GNAHSEngine"
        className="min-h-[480px] w-full"
        aria-label="Motor de reservas"
      />
      <BookingEngine region={region} />
    </main>
  );
}
