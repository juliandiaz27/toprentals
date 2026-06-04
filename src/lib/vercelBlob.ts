import path from "path";
import { del, get, put } from "@vercel/blob";

const PREFIX = "top-rentals";
const BLOB_ACCESS = "private" as const;

export function useBlobStorage(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export function isVercelDeploy(): boolean {
  return process.env.VERCEL === "1";
}

/** Clave en Blob a partir de ruta de archivo en el repo (ej. home-content.json). */
export function blobKeyFromFilePath(filePath: string): string {
  const base = path.basename(filePath);
  return `${PREFIX}/content/${base}`;
}

export function blobKeyForUpload(filename: string): string {
  return `${PREFIX}/uploads/${filename}`;
}

/** URL servida por la app para blobs privados (imágenes/videos en el sitio). */
export function mediaUrlFromBlobKey(key: string): string {
  return `/api/media/${key.split("/").map(encodeURIComponent).join("/")}`;
}

export function blobKeyFromMediaUrl(url: string): string | null {
  if (!url.startsWith("/api/media/")) return null;
  const encoded = url.slice("/api/media/".length);
  try {
    return encoded.split("/").map(decodeURIComponent).join("/");
  } catch {
    return null;
  }
}

export async function readBlobJson<T>(key: string): Promise<T | null> {
  if (!useBlobStorage()) return null;

  const result = await get(key, { access: BLOB_ACCESS });
  if (!result || result.statusCode !== 200 || !result.stream) return null;

  const text = await new Response(result.stream).text();
  return JSON.parse(text) as T;
}

export async function writeBlobJson(key: string, data: unknown): Promise<void> {
  const body = JSON.stringify(data, null, 2) + "\n";
  await put(key, body, {
    access: BLOB_ACCESS,
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

export async function writeBlobFile(
  key: string,
  body: Buffer | ArrayBuffer,
  contentType: string,
): Promise<string> {
  await put(key, body, {
    access: BLOB_ACCESS,
    contentType,
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  return mediaUrlFromBlobKey(key);
}

export async function deleteBlobUrl(url: string): Promise<void> {
  const fromMedia = blobKeyFromMediaUrl(url);
  if (fromMedia) {
    await del(fromMedia);
    return;
  }
  if (!url.includes("blob.vercel-storage.com")) return;
  await del(url);
}

export function blobStorageRequiredMessage(): string {
  return (
    "No se puede guardar en disco en Vercel. Creá un Blob Store en el proyecto " +
    "(Storage → Blob → Connect) para habilitar guardado del panel."
  );
}
