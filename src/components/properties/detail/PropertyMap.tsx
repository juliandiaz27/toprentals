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

/** Mapa de la ficha (Figma: bloque redondeado, sin marco). */
export function PropertyMap({ address, neighborhood, city }: Props) {
  if (!address?.trim()) {
    return (
      <div className="flex min-h-[260px] items-center justify-center rounded-2xl bg-neutral-200 lg:min-h-[260px]">
        <span className="text-[13px] text-neutral-500">Ubicación no disponible</span>
      </div>
    );
  }

  const query = buildPropertyMapQuery(address, neighborhood, city);
  const embedUrl = googleMapsEmbedUrl(query);
  const mapsUrl = googleMapsOpenUrl(query);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-neutral-100">
      <iframe
        title={`Mapa — ${address}`}
        src={embedUrl}
        className="block h-[260px] w-full border-0 lg:h-[270px]"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
      <Link
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-3 right-3 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-medium text-tr-ink shadow-sm hover:bg-white"
      >
        Ver en Google Maps →
      </Link>
    </div>
  );
}
