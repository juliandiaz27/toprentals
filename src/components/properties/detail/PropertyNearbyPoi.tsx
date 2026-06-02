import type { PropertyNearbyPoi } from "@/lib/properties/details";

type Props = {
  poi: PropertyNearbyPoi;
};

export function PropertyNearbyPoiList({ poi }: Props) {
  if (!poi.columns.length) return null;

  return (
    <div className="mt-10">
      <p className="text-[13px] font-normal text-[#AAAAAA]">{poi.sectionTitle}</p>
      <ul className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
        {poi.columns.map((column, colIdx) => (
          <li key={colIdx} className="flex flex-col gap-2">
            {column.map((place) => (
              <span
                key={place}
                className="text-[14px] leading-snug text-neutral-800 lg:text-[15px]"
              >
                {place}
              </span>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}
