"use client";

import { useRef, useState, useTransition } from "react";
import { uploadImage, removeImage } from "./actions";

type Props = {
  slotKey: string;
  label: string;
  hint?: string;
  currentUrl: string;
  fallback: string;
};

export function ImageUploader({
  slotKey,
  label,
  hint,
  currentUrl,
  fallback,
}: Props) {
  const [preview, setPreview] = useState(currentUrl);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const displayUrl = preview || fallback;
  const hasOverride = preview !== fallback && preview !== "";

  function onFileChange() {
    const file = inputRef.current?.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setError(null);
  }

  function handleSave() {
    const file = inputRef.current?.files?.[0];
    if (!file) {
      setError("Seleccioná un archivo primero.");
      return;
    }
    const fd = new FormData();
    fd.append("file", file);
    startTransition(async () => {
      const res = await uploadImage(slotKey, fd);
      if (!res.ok) {
        setError(res.error ?? "Error al guardar");
        setPreview(currentUrl || fallback);
        return;
      }
      setError(null);
      window.location.reload();
    });
  }

  function handleReset() {
    if (!confirm("¿Restablecer esta imagen al valor por defecto?")) return;
    startTransition(async () => {
      const res = await removeImage(slotKey);
      if (!res.ok) {
        setError(res.error ?? "Error");
        return;
      }
      setPreview(fallback);
      setError(null);
      if (inputRef.current) inputRef.current.value = "";
      window.location.reload();
    });
  }

  return (
    <article className="admin-image-card">
      <div className="admin-image-card__preview">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={displayUrl} alt={label} className="h-full w-full object-cover" />
        {hasOverride ? <span className="admin-tag-custom">Custom</span> : null}
      </div>
      <div className="admin-image-card__body">
        <h3 className="admin-image-card__title">{label}</h3>
        {hint ? (
          <p className="mt-0.5 text-xs text-[var(--admin-text-dim)]">{hint}</p>
        ) : null}
        <p className="admin-image-card__slug">{slotKey}</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="mt-3 w-full"
          onChange={onFileChange}
          disabled={pending}
        />
        {error ? (
          <p className="mt-2 text-xs text-red-400" role="alert">
            {error}
          </p>
        ) : null}
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={pending}
            className="admin-btn-primary px-3 py-1.5 text-xs"
          >
            {pending ? "Guardando…" : "Guardar"}
          </button>
          {hasOverride ? (
            <button
              type="button"
              onClick={handleReset}
              disabled={pending}
              className="admin-btn-secondary px-3 py-1.5 text-xs"
            >
              Restaurar original
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
