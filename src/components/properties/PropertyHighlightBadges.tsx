type Props = {
  hasOffer?: boolean;
  isPopular?: boolean;
  className?: string;
  size?: "sm" | "md";
};

function IconTag() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L3 13V3h10l7.59 7.59a2 2 0 010 2.82z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" />
    </svg>
  );
}

function IconTrending() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M23 6l-9.5 9.5-5-5L1 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 6h6v6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PropertyHighlightBadges({
  hasOffer,
  isPopular,
  className = "",
  size = "md",
}: Props) {
  if (!hasOffer && !isPopular) return null;

  const pill =
    size === "sm"
      ? "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide shadow-sm"
      : "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide shadow-sm";

  return (
    <div
      className={`flex flex-wrap gap-1.5 ${className}`.trim()}
      aria-label="Destacados de la propiedad"
    >
      {hasOffer ? (
        <span className={`${pill} bg-[#f27438] text-white`}>
          <IconTag />
          Oferta
        </span>
      ) : null}
      {isPopular ? (
        <span className={`${pill} bg-[#1d4ed8] text-white`}>
          <IconTrending />
          Más solicitada
        </span>
      ) : null}
    </div>
  );
}
