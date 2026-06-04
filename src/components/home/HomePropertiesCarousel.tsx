"use client";

import { useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { FormattedText } from "@/components/content/FormattedText";
import type { HomeFeaturedContent } from "@/lib/pageContent/homeTypes";
import type { PropertyListing } from "@/lib/properties/catalog";
import { HomeFeaturedPropertyCard } from "./HomeFeaturedPropertyCard";

/** px/s — desplazamiento constante */
const SCROLL_SPEED_PX = 48;

/** Ancho fijo por tarjeta (~5 visibles en 1440px con gaps) */
const SLIDE_WIDTH_CLASS = "w-[220px] shrink-0 sm:w-[236px] lg:w-[252px]";

type Props = {
  featured: HomeFeaturedContent;
  properties: PropertyListing[];
};

function propertyHref(property: PropertyListing): string {
  if (property.comingSoon) return "/propiedades";
  return `/propiedades/${property.slug}`;
}

export function HomePropertiesCarousel({ featured, properties }: Props) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [paused, setPaused] = useState(false);
  const [marqueeVars, setMarqueeVars] = useState<{
    distance: number;
    duration: number;
  } | null>(null);

  const count = properties.length;

  const loopItems = useMemo(
    () => (count > 0 ? [...properties, ...properties] : []),
    [properties, count],
  );

  const canMarquee = count > 1 && marqueeVars != null && marqueeVars.distance > 0;

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track || count <= 1) {
      setMarqueeVars(null);
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMarqueeVars(null);
      return;
    }

    const measure = () => {
      const distance = track.scrollWidth / 2;
      if (distance <= 0) return;
      setMarqueeVars({
        distance,
        duration: distance / SCROLL_SPEED_PX,
      });
    };

    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(track);

    const images = track.querySelectorAll("img");
    images.forEach((img) => {
      if (!img.complete) img.addEventListener("load", measure, { once: true });
    });

    return () => resizeObserver.disconnect();
  }, [count, properties]);

  if (count === 0) return null;

  return (
    <section
      className="border-b border-neutral-200 bg-[#F8F8F8]"
      aria-labelledby="home-featured-properties-heading"
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 py-10 md:px-10 md:py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2
            id="home-featured-properties-heading"
            className="text-[clamp(1.35rem,2.5vw,1.75rem)] font-bold leading-tight text-neutral-950"
          >
            <FormattedText value={featured.title} as="inline" />
          </h2>
          <Link
            href={featured.linkHref}
            className="text-[14px] font-medium text-neutral-950 hover:underline"
          >
            {featured.linkLabel}
          </Link>
        </div>

        <div
          className="relative mt-8 w-full"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
              setPaused(false);
            }
          }}
        >
          <div className="w-full overflow-hidden" aria-roledescription="carousel">
            <ul
              ref={trackRef}
              className={`flex w-max flex-nowrap items-stretch gap-5 ${
                canMarquee ? "home-properties-marquee" : ""
              }`}
              style={
                canMarquee
                  ? ({
                      ["--marquee-distance" as string]: `-${marqueeVars.distance}px`,
                      animationDuration: `${marqueeVars.duration}s`,
                      animationPlayState: paused ? "paused" : "running",
                    } as CSSProperties)
                  : undefined
              }
            >
              {loopItems.map((property, i) => (
                <li
                  key={`${property.slug}-${i}`}
                  className={SLIDE_WIDTH_CLASS}
                  aria-hidden={count > 1 && i >= count ? true : undefined}
                >
                  <HomeFeaturedPropertyCard
                    property={property}
                    href={propertyHref(property)}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
