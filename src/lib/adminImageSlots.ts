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
  {
    key: "carreras-hero",
    label: "Carreras — Hero",
    fallback: "/images/placeholders/page-hero.svg",
    category: "Páginas",
  },
  {
    key: "cursos-hero",
    label: "Cursos — Hero",
    fallback: "/images/placeholders/page-hero.svg",
    category: "Páginas",
  },
  {
    key: "profesores-hero",
    label: "Profesores — Hero",
    fallback: "/images/placeholders/page-hero.svg",
    category: "Páginas",
  },
  {
    key: "egresados-hero",
    label: "Egresados — Hero",
    fallback: "/images/placeholders/page-hero.svg",
    category: "Páginas",
  },
];

export type EntityImageKind =
  | "profesores"
  | "egresados"
  | "carreras"
  | "cursos"
  | "postitulos";

export const ENTITY_IMAGE_LABELS: Record<EntityImageKind, string> = {
  profesores: "Profesores",
  egresados: "Egresados",
  carreras: "Carreras",
  cursos: "Cursos",
  postitulos: "Postítulos",
};
