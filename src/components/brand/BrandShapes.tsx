/** Formas geométricas del rebranding (Figma) — decorativas, sin contenido. */

type ShapeProps = {
  className?: string;
};

/** Arco simple: rectángulo con tope semicircular. */
export function BrandArch({ className = "" }: ShapeProps) {
  return (
    <svg viewBox="0 0 48 44" className={className} fill="currentColor" aria-hidden>
      <path d="M0 24a24 24 0 0 1 48 0v20H0z" />
    </svg>
  );
}

/** Dos arcos apilados (motivo del logo). */
export function BrandArchStack({ className = "" }: ShapeProps) {
  return (
    <svg viewBox="0 0 48 88" className={className} fill="currentColor" aria-hidden>
      <path d="M0 24a24 24 0 0 1 48 0v18H0z" />
      <path d="M0 66a24 24 0 0 1 48 0v22H0z" />
    </svg>
  );
}

/** Cúpula baja (media elipse). */
export function BrandDome({ className = "" }: ShapeProps) {
  return (
    <svg viewBox="0 0 48 26" className={className} fill="currentColor" aria-hidden>
      <path d="M0 26C0 12 10 2 24 2s24 10 24 24z" />
    </svg>
  );
}

/** Tamaño y color de cada BenefitShape, en el orden del Figma. */
export const BENEFIT_SHAPE_STYLES = [
  "h-5 w-[52px] text-tr-orange",
  "h-7 w-[42px] text-tr-amber",
  "h-[30px] w-7 text-tr-red",
  "h-[26px] w-[42px] text-tr-sky",
];

/** Íconos de las tarjetas “Beneficios de reservar directo”. */
export function BenefitShape({
  variant,
  className = "",
}: ShapeProps & { variant: number }) {
  switch (variant % 4) {
    case 0:
      return (
        <svg viewBox="0 0 52 20" className={className} fill="currentColor" aria-hidden>
          <path d="M0 0h42a10 10 0 0 1 10 10v10H0z" />
        </svg>
      );
    case 1:
      return (
        <svg viewBox="0 0 42 28" className={className} fill="currentColor" aria-hidden>
          <path d="M0 0h12a9 9 0 0 1 9 9v19H9a9 9 0 0 1-9-9z" />
          <path d="M21 0h21v28H30a9 9 0 0 1-9-9z" />
        </svg>
      );
    case 2:
      return (
        <svg viewBox="0 0 28 30" className={className} fill="currentColor" aria-hidden>
          <path d="M0 0h13a15 15 0 0 1 0 30H0z" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 42 26" className={className} fill="currentColor" aria-hidden>
          <path d="M0 0h32l10 13-10 13H0z" />
        </svg>
      );
  }
}

export function CheckCircleIcon({ className = "" }: ShapeProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10.25" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M7.5 12.3l3 3 6-6.3"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Logotipo en texto (“TopRentals®”) mientras no haya SVG oficial cargado. */
export function BrandWordmark({ className = "" }: ShapeProps) {
  return (
    <span className={`inline-flex items-start leading-none tracking-[-0.02em] ${className}`.trim()}>
      <span className="font-bold">Top</span>
      <span className="font-normal">Rentals</span>
      <span className="ml-0.5 text-[0.35em] font-normal" aria-hidden>
        ®
      </span>
    </span>
  );
}

/**
 * Edificios estilizados (Figma, debajo de “Soluciones de alojamiento”):
 * tres torres de pisos con ventanas rojo/celeste y franja verde; la del medio más alta.
 */
const BUILDING_TOWERS = [
  { x: 0, top: 60, floors: 4 },
  { x: 130, top: 0, floors: 5 },
  { x: 260, top: 60, floors: 4 },
];

export function BrandBuildings({ className = "" }: ShapeProps) {
  return (
    <svg viewBox="0 0 390 196" className={className} aria-hidden>
      {BUILDING_TOWERS.map((tower) => (
        <g key={tower.x}>
          <rect x={tower.x} y={tower.top} width="130" height="6" fill="#F9F7F3" />
          {Array.from({ length: tower.floors }, (_, floor) => {
            const y = tower.top + 6 + floor * 38;
            return (
              <g key={floor}>
                {[0, 1, 2, 3, 4].map((col) => (
                  <rect
                    key={col}
                    x={tower.x + col * 26}
                    y={y}
                    width="26"
                    height="16"
                    fill={col % 2 === 0 ? "#812525" : "#CAE5F6"}
                  />
                ))}
                <rect x={tower.x} y={y + 16} width="130" height="13" fill="#0A543D" />
              </g>
            );
          })}
        </g>
      ))}
    </svg>
  );
}

/**
 * Banda crema con dos arcos (Figma, 2142×770): fondo de «Nuestros edificios» en la home
 * y de «Sobre el edificio» en la ficha. El frame de 1440 empieza en x=259, así que para
 * centrarla se posiciona con `left-[calc(50%-979px)]` y `w-[2142px] h-[770px]`.
 */
export function BrandWaveBand({ className = "" }: ShapeProps) {
  return (
    <svg viewBox="-259 0 2142 770" fill="currentColor" className={className} aria-hidden>
      <path d="M1218.45 770H1599.06C1755.87 770 1883 642.779 1883 485.861V284.139C1883 127.222 1755.87 0 1599.06 0H1218.45C1190.86 0 1168.5 22.378 1168.5 49.983V284.139C1168.5 127.222 1041.37 0 884.559 0H503.953C476.367 0 454.005 22.378 454.005 49.983V254.966C439.404 111.739 318.513 0 171.554 0H-209.052C-236.638 0 -259 22.378 -259 49.983V719.993C-259 747.598 -236.638 769.975 -209.052 769.975H1218.45V770Z" />
    </svg>
  );
}
