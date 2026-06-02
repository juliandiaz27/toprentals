export type ConfigImageSlot = {
  key: string;
  label: string;
  hint?: string;
  fallback: string;
  category: string;
};

export const CONFIG_IMAGE_SLOTS: ConfigImageSlot[] = [
  {
    key: "home-hero",
    label: "Home — Hero principal",
    hint: "Imagen de cabecera del inicio",
    fallback: "/images/placeholders/home-hero.svg",
    category: "Home",
  },
  {
    key: "home-columna-1",
    label: "Home — Columna 1",
    fallback: "/images/placeholders/column.svg",
    category: "Home",
  },
  {
    key: "home-columna-2",
    label: "Home — Columna 2",
    fallback: "/images/placeholders/column.svg",
    category: "Home",
  },
  {
    key: "home-columna-3",
    label: "Home — Columna 3",
    fallback: "/images/placeholders/column.svg",
    category: "Home",
  },
];
