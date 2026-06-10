import type { MobileBottomNavIcon } from "@/lib/pageContent/mobileBottomNav";

type Props = {
  name: MobileBottomNavIcon;
  active?: boolean;
};

export function MobileBottomNavIconSvg({ name, active = false }: Props) {
  const stroke = active ? "#0a0a0a" : "#737373";
  const sw = active ? 2.25 : 1.75;

  switch (name) {
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
    case "properties":
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
    case "club":
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
    case "about":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="8" r="3.25" stroke={stroke} strokeWidth={sw} />
          <path
            d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinecap="round"
          />
        </svg>
      );
    case "more":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M5 7h14M5 12h14M5 17h14"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinecap="round"
          />
        </svg>
      );
  }
}
