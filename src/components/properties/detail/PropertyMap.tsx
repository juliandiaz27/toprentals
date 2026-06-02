import Link from "next/link";
import type { PropertyCity } from "@/lib/properties/catalog";
import {
  buildPropertyMapQuery,
  googleMapsEmbedUrl,
  googleMapsOpenUrl,
} from "@/lib/properties/mapQuery";

type Props = {
  address: string;
  neighborhood: string;
  city: PropertyCity;
};

export function PropertyMap({ address, neighborhood, city }: Props) {
  if (!address?.trim()) {
    return (
      <div className="flex min-h-[280px] items-center justify-center rounded-lg bg-neutral-200 lg:min-h-[320px]">
        <span className="text-[13px] text-neutral-500">Ubicación no disponible</span>
      </div>
    );
  }

  const query = buildPropertyMapQuery(address, neighborhood, city);
  const embedUrl = googleMapsEmbedUrl(query);
  const mapsUrl = googleMapsOpenUrl(query);

  const addressLine = [address, neighborhood, city].filter(Boolean).join(" · ");

  return (
    <div className="flex min-h-[280px] flex-col overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100 lg:min-h-[320px]">
      <div className="border-b border-neutral-200 bg-white px-4 py-3">
        <p className="text-[13px] font-medium text-neutral-950">{addressLine}</p>
        <Link
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-block text-[12px] text-neutral-600 underline-offset-2 hover:text-neutral-950 hover:underline"
        >
          Ver en Google Maps →
        </Link>
      </div>
      <iframe
        title={`Mapa — ${address}`}
        src={embedUrl}
        className="min-h-[240px] w-full flex-1 border-0 lg:min-h-[260px]"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
