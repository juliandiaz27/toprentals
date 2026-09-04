"use client";

import { useEffect } from "react";
import {
  ELFSIGHT_PLATFORM_SRC,
  parseElfsightAppId,
} from "@/lib/elfsight";

const SCRIPT_ID = "elfsight-platform-js";

type Props = {
  /** App ID o snippet completo de Elfsight. */
  appId?: string | null;
  title?: string;
  className?: string;
};

function ensureElfsightPlatform(): void {
  if (typeof document === "undefined") return;
  if (document.getElementById(SCRIPT_ID)) return;

  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.src = ELFSIGHT_PLATFORM_SRC;
  script.async = true;
  document.body.appendChild(script);
}

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

  useEffect(() => {
    if (!id) return;
    ensureElfsightPlatform();
  }, [id]);

  if (!id) return null;

  return (
    <section
      className={`bg-white ${className}`}
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
    </section>
  );
}
