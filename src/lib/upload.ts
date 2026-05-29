import fs from "fs/promises";
import path from "path";

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

export async function saveUpload(
  file: File,
  basename: string,
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
  const ext = extensionFromFile(file);
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });
  const filename = `${basename}.${ext}`;
  const diskPath = path.join(uploadsDir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(diskPath, buffer);
  return `/uploads/${filename}`;
}

export async function deleteUploadByUrl(url: string): Promise<void> {
  if (!url.startsWith("/uploads/")) return;
  const diskPath = path.join(process.cwd(), "public", url);
  try {
    await fs.unlink(diskPath);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
  }
}
