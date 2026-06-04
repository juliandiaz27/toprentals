/** Directrices de medidas y peso para subidas en el panel. */
export type MediaUploadGuide = {
  /** Ej. "1920 × 1080 px (16:9)" */
  recommendedSize?: string;
  maxSizeMb?: number;
  /** Ej. "JPG, PNG o WebP" */
  formats?: string;
  notes?: string[];
};

export const MEDIA_UPLOAD_GUIDES = {
  heroBannerVideo: {
    recommendedSize: "1920 × 1080 px (16:9), pantalla completa",
    maxSizeMb: 15,
    formats: "MP4 o WebM",
    notes: [
      "Duración sugerida: 15–30 s",
      "Sin audio o audio muy bajo (se reproduce en silencio por defecto)",
    ],
  },
  heroBannerPoster: {
    recommendedSize: "1920 × 1080 px (16:9)",
    maxSizeMb: 1,
    formats: "JPG, PNG o WebP",
    notes: ["Primera imagen que se ve mientras carga el video"],
  },
  pageHero: {
    recommendedSize: "1600 × 900 px (16:9)",
    maxSizeMb: 2,
    formats: "JPG, PNG o WebP",
  },
  corporateHero: {
    recommendedSize: "1600 × 1000 px (8:5), horizontal",
    maxSizeMb: 2,
    formats: "JPG, PNG o WebP",
    notes: ["Buena luz; evitar textos muy chicos en la foto"],
  },
  sectionPhoto: {
    recommendedSize: "1200 × 800 px (horizontal)",
    maxSizeMb: 2,
    formats: "JPG, PNG o WebP",
  },
  siteLogo: {
    recommendedSize: "Ancho ~240 px · alto ~48 px",
    maxSizeMb: 0.3,
    formats: "PNG o SVG",
    notes: ["Fondo transparente recomendado"],
  },
  blogCover: {
    recommendedSize: "1200 × 750 px (16:10)",
    maxSizeMb: 2,
    formats: "JPG, PNG o WebP",
  },
  propertyListing: {
    recommendedSize: "1280 × 720 px (16:9)",
    maxSizeMb: 2,
    formats: "JPG, PNG o WebP",
    notes: ["Fachada o interior del edificio"],
  },
  propertyGallery: {
    recommendedSize: "Mín. 1200 px de ancho (horizontal o cuadrada)",
    maxSizeMb: 2,
    formats: "JPG, PNG o WebP",
    notes: ["3 o más fotos para carrusel y laterales"],
  },
  homeColumn: {
    recommendedSize: "600 × 800 px (vertical)",
    maxSizeMb: 1.5,
    formats: "JPG, PNG o WebP",
  },
} as const satisfies Record<string, MediaUploadGuide>;

const GUIDE_BY_FIELD_KEY: Record<string, MediaUploadGuide> = {
  "hero.videoSrc": MEDIA_UPLOAD_GUIDES.heroBannerVideo,
  "hero.posterSrc": MEDIA_UPLOAD_GUIDES.heroBannerPoster,
  "history.imageSrc": MEDIA_UPLOAD_GUIDES.sectionPhoto,
};

export function resolveUploadGuide(field: {
  key: string;
  type: string;
  uploadGuide?: MediaUploadGuide;
}): MediaUploadGuide | undefined {
  if (field.uploadGuide) return field.uploadGuide;
  if (field.type !== "image" && field.type !== "video") return undefined;
  return (
    GUIDE_BY_FIELD_KEY[field.key] ??
    (field.type === "video"
      ? MEDIA_UPLOAD_GUIDES.heroBannerVideo
      : MEDIA_UPLOAD_GUIDES.pageHero)
  );
}

export function maxBytesForGuide(guide?: MediaUploadGuide): number | undefined {
  if (!guide?.maxSizeMb) return undefined;
  return Math.round(guide.maxSizeMb * 1024 * 1024);
}

export function validateFileAgainstGuide(
  file: File,
  guide?: MediaUploadGuide,
): string | null {
  const maxBytes = maxBytesForGuide(guide);
  if (maxBytes != null && file.size > maxBytes) {
    const mb = guide?.maxSizeMb ?? maxBytes / (1024 * 1024);
    return `El archivo pesa ${(file.size / (1024 * 1024)).toFixed(1)} MB. El máximo permitido es ${mb} MB.`;
  }
  return null;
}
