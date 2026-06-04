import fs from "fs/promises";
import path from "path";
import {
  blobKeyForUpload,
  blobStorageRequiredMessage,
  deleteBlobUrl,
  isVercelDeploy,
  useBlobStorage,
  writeBlobFile,
} from "@/lib/vercelBlob";

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

const VIDEO_TYPES = new Set(["video/mp4", "video/webm"]);

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "video/mp4": "mp4",
  "video/webm": "webm",
};

export function extensionFromFile(file: File): string {
  const fromMime = EXT_BY_TYPE[file.type];
  if (fromMime) return fromMime;
  const ext = path.extname(file.name).slice(1).toLowerCase();
  if (ext) return ext;
  return "jpg";
}

export type SaveUploadOptions = {
  maxSizeMb?: number;
};

export async function saveUpload(
  file: File,
  basename: string,
  options?: SaveUploadOptions,
): Promise<string> {
  const isImage =
    IMAGE_TYPES.has(file.type) || /\.(jpe?g|png|webp|gif|svg)$/i.test(file.name);
  const isVideo =
    VIDEO_TYPES.has(file.type) || /\.(mp4|webm)$/i.test(file.name);

  if (!isImage && !isVideo) {
    throw new Error(
      "Tipo no permitido. Imágenes: JPEG, PNG, WebP, GIF, SVG. Video: MP4 o WebM.",
    );
  }

  if (options?.maxSizeMb != null) {
    const maxBytes = Math.round(options.maxSizeMb * 1024 * 1024);
    if (file.size > maxBytes) {
      throw new Error(
        `El archivo supera el máximo de ${options.maxSizeMb} MB (${(file.size / (1024 * 1024)).toFixed(1)} MB).`,
      );
    }
  }

  const ext = extensionFromFile(file);
  const filename = `${basename}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  if (useBlobStorage()) {
    return writeBlobFile(blobKeyForUpload(filename), buffer, file.type || "application/octet-stream");
  }

  if (isVercelDeploy()) {
    throw new Error(blobStorageRequiredMessage());
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });
  const diskPath = path.join(uploadsDir, filename);
  await fs.writeFile(diskPath, buffer);
  return `/uploads/${filename}`;
}

export async function deleteUploadByUrl(url: string): Promise<void> {
  if (url.includes("blob.vercel-storage.com")) {
    await deleteBlobUrl(url);
    return;
  }

  if (!url.startsWith("/uploads/")) return;
  const diskPath = path.join(process.cwd(), "public", url);
  try {
    await fs.unlink(diskPath);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
  }
}
