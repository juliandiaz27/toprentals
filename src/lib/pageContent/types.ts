import type { MediaUploadGuide } from "@/lib/mediaUploadGuide";

export type PageFieldType =
  | "text"
  | "textarea"
  | "rich"
  | "image"
  | "video"
  | "url"
  | "boolean";

export type RoutePickerPreset = "menu" | "destinations" | "investor";

export type PageField = {
  key: string;
  label: string;
  type: PageFieldType;
  section: string;
  hint?: string;
  fallback?: string;
  required?: boolean;
  /** Ruta fija: el panel no permite cambiarla. */
  lockedHref?: string;
  /** Selector de página interna (sin escribir URL a mano). */
  routePreset?: RoutePickerPreset;
  /** Medidas y peso recomendados para campos image/video. */
  uploadGuide?: MediaUploadGuide;
};

export type PageDefinition = {
  slug: string;
  title: string;
  publicPath: string;
  description?: string;
  fields: PageField[];
};

export type PageContent = Record<string, unknown>;
