type Props = {
  count: number;
  activeIndex: number;
  /** 0–1 progreso del slide activo */
  progress: number;
};

/**
 * Indicadores de carrusel — sobre el video, debajo del buscador flotante (z-10 < buscador z-20).
 */
export function HeroProgressBar({ count, activeIndex, progress }: Props) {
  return (
    <div
      className="hero-progress pointer-events-none absolute bottom-20 left-0 right-0 z-10 flex gap-[3px] px-6 lg:bottom-[5.5rem] lg:px-12"
      role="progressbar"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Banner ${activeIndex + 1} de ${count}`}
    >
      {Array.from({ length: count }).map((_, i) => {
        let fill = 0;
        if (i < activeIndex) fill = 100;
        else if (i === activeIndex) fill = Math.min(100, Math.max(0, progress * 100));

        return (
          <div
            key={i}
            className="h-[2px] min-w-0 flex-1 overflow-hidden rounded-full bg-white/20"
          >
            <div
              className="h-full rounded-full bg-white transition-[width] duration-75 ease-linear"
              style={{ width: `${fill}%` }}
            />
          </div>
        );
      })}
    </div>
  );
}
