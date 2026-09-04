import Script from "next/script";
import {
  ELFSIGHT_PLATFORM_SRC,
  parseElfsightAppId,
} from "@/lib/elfsight";

type Props = {
  /** App ID o snippet completo de Elfsight. */
  appId?: string | null;
  title?: string;
  className?: string;
};

/**
 * Carrusel de reseñas Google vía Elfsight.
 * No renderiza nada si no hay App ID válido.
 */
export function ElfsightGoogleReviews({
  appId,
  title,
  className = "",
}: Props) {
  const id = parseElfsightAppId(appId ?? "");
  if (!id) return null;

  return (
    <section
      className={`border-b border-neutral-200 bg-white ${className}`}
      aria-label={title || "Google reviews"}
    >
      <div className="mx-auto w-full max-w-[1440px]">
        {title ? (
          <h2 className="mb-8 text-[clamp(1.35rem,2.5vw,1.75rem)] font-bold leading-tight text-neutral-950">
            {title}
          </h2>
        ) : null}
        <div className={`elfsight-app-${id}`} data-elfsight-app-lazy />
      </div>
      <Script src={ELFSIGHT_PLATFORM_SRC} strategy="lazyOnload" />
    </section>
  );
}
