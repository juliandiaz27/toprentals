type Props = {
  count: number;
  activeIndex: number;
  /** 0–1 progreso del slide activo */
  progress: number;
};

export function HeroProgressBar({ count, activeIndex, progress }: Props) {
  return (
    <div
      className="hero-progress absolute bottom-0 left-0 right-0 z-30 flex gap-[3px] px-0"
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
            className="h-[2px] min-w-0 flex-1 overflow-hidden bg-white/25"
          >
            <div
              className="h-full bg-white transition-[width] duration-75 ease-linear"
              style={{ width: `${fill}%` }}
            />
          </div>
        );
      })}
    </div>
  );
}
