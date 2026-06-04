import type { MediaUploadGuide } from "@/lib/mediaUploadGuide";

type Props = {
  guide: MediaUploadGuide;
  className?: string;
};

/** Leyenda compacta bajo cada control de subida de imagen o video. */
export function MediaUploadGuide({ guide, className = "" }: Props) {
  const hasSize = Boolean(guide.recommendedSize);
  const hasMax = guide.maxSizeMb != null;
  const hasFormats = Boolean(guide.formats);
  const hasNotes = (guide.notes?.length ?? 0) > 0;

  if (!hasSize && !hasMax && !hasFormats && !hasNotes) return null;

  return (
    <div className={`admin-media-guide ${className}`.trim()} role="note">
      {hasSize ? (
        <p>
          <span className="admin-media-guide__label">Medidas recomendadas:</span>{" "}
          {guide.recommendedSize}
        </p>
      ) : null}
      {hasMax ? (
        <p>
          <span className="admin-media-guide__label">Peso máximo:</span>{" "}
          {guide.maxSizeMb} MB
        </p>
      ) : null}
      {hasFormats ? (
        <p>
          <span className="admin-media-guide__label">Formatos:</span> {guide.formats}
        </p>
      ) : null}
      {hasNotes ? (
        <ul className="admin-media-guide__notes">
          {guide.notes!.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
