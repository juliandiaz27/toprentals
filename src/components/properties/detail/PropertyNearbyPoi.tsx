import type { PropertyNearbyPoi } from "@/lib/properties/details";

type Props = {
  poi: PropertyNearbyPoi;
};

export function PropertyNearbyPoiList({ poi }: Props) {
  const places = poi.columns.flat().filter(Boolean);
  if (!places.length) return null;

  return (
    <div className="mt-10">
      <p className="text-[13px] font-normal text-[#AAAAAA]">{poi.sectionTitle}</p>
      <ul className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
        {places.map((place) => (
          <li key={place}>
            <span className="text-[14px] leading-snug text-neutral-800 lg:text-[15px]">
              {place}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
