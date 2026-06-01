"use client";

import { useRef, useState, useTransition } from "react";
import { uploadEntityImage } from "./actions";
import type { EntityImageKind } from "@/lib/adminImageSlots";

type Props = {
  entity: EntityImageKind;
  id: string;
  label: string;
  currentSrc: string;
};

export function EntityImageUploader({ entity, id, label, currentSrc }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const src = currentSrc || "/images/placeholders/person.svg";
  const isCustom = Boolean(currentSrc && !currentSrc.includes("placeholders"));

  function handleSave() {
    const file = inputRef.current?.files?.[0];
    if (!file) {
      setError("Seleccioná un archivo.");
      return;
    }
    const fd = new FormData();
    fd.append("file", file);
    startTransition(async () => {
      const res = await uploadEntityImage(entity, id, fd);
      if (!res.ok) {
        setError(res.error ?? "Error al subir");
        return;
      }
      setError(null);
      window.location.reload();
    });
  }

  return (
    <article className="admin-image-card">
      <div className="admin-image-card__preview aspect-square">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={label} className="h-full w-full object-cover" />
        {isCustom ? <span className="admin-tag-custom">Custom</span> : null}
      </div>
      <div className="admin-image-card__body">
        <h3 className="admin-image-card__title">{label}</h3>
        <p className="admin-image-card__slug">{id}</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="mt-3 w-full"
          disabled={pending}
        />
        {error ? (
          <p className="mt-2 text-xs text-red-400" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="button"
          onClick={handleSave}
          disabled={pending}
          className="admin-btn-primary mt-3 px-3 py-1.5 text-xs"
        >
          {pending ? "Subiendo…" : "Guardar foto"}
        </button>
      </div>
    </article>
  );
}
