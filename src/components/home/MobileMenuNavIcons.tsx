import type { HeaderNavId } from "@/lib/pageContent/headerNav";

type Props = {
  id: HeaderNavId;
};

const stroke = "#1e293b";
const sw = 1.75;

export function MobileMenuNavIcon({ id }: Props) {
  switch (id) {
    case "home":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
        </svg>
      );
    case "propiedades":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M4 20V8.5l8-4.5 8 4.5V20M9 20v-6h6v6"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "corporate":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M8 7V4h8v3M6 20h12a1 1 0 0 0 1-1V9H5v10a1 1 0 0 0 1 1Z"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
          <path d="M10 12h4M10 16h4" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        </svg>
      );
    case "real-estate":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M4 20V10l8-5 8 5v10M9 20v-5h6v5"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
        </svg>
      );
    case "club-top-rentals":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 3.5 14.2 9H20l-4.8 3.5 1.8 5.5L12 15.8 7 18l1.8-5.5L4 9h5.8L12 3.5Z"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
        </svg>
      );
    case "nosotros":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="9" cy="8" r="2.5" stroke={stroke} strokeWidth={sw} />
          <circle cx="16" cy="9.5" r="2" stroke={stroke} strokeWidth={sw} />
          <path
            d="M4 19c0-2.5 2.2-4.5 5-4.5s5 2 5 4.5M14 19c0-1.8 1.5-3.2 3.5-3.5"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinecap="round"
          />
        </svg>
      );
    case "trabaja-con-nosotros":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M8 6h8v12H8V6ZM10 4h4v2h-4V4ZM11 11h2M11 15h2"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "blog":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M6 4h12a1 1 0 0 1 1 1v15l-4-2.5L11 20V5a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h3"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
        </svg>
      );
    case "contacto":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M4 7.5 12 13l8-5.5V18a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7.5Z"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}
