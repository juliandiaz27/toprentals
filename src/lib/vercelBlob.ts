import path from "path";
import { del, list, put } from "@vercel/blob";

const PREFIX = "top-rentals";

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

export async function readBlobJson<T>(key: string): Promise<T | null> {
  if (!useBlobStorage()) return null;

  const { blobs } = await list({ prefix: key, limit: 10 });
  const match = blobs.find((b) => b.pathname === key);
  if (!match) return null;

  const res = await fetch(match.url, { cache: "no-store" });
  if (!res.ok) return null;
  return (await res.json()) as T;
}

export async function writeBlobJson(key: string, data: unknown): Promise<void> {
  const body = JSON.stringify(data, null, 2) + "\n";
  await put(key, body, {
    access: "public",
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
  const blob = await put(key, body, {
    access: "public",
    contentType,
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  return blob.url;
}

export async function deleteBlobUrl(url: string): Promise<void> {
  if (!url.includes("blob.vercel-storage.com")) return;
  await del(url);
}

export function blobStorageRequiredMessage(): string {
  return (
    "No se puede guardar en disco en Vercel. Creá un Blob Store en el proyecto " +
    "(Storage → Blob → Connect) para habilitar guardado del panel."
  );
}
