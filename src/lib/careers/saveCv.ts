import fs from "fs/promises";
import path from "path";
import {
  CAREERS_CV_EXT,
  CAREERS_CV_MAX_MB,
  CAREERS_CV_TYPES,
} from "./constants";
import {
  blobKeyForUpload,
  blobStorageRequiredMessage,
  isVercelDeploy,
  useBlobStorage,
  writeBlobFile,
} from "@/lib/vercelBlob";

function extensionFromCv(file: File): string | null {
  const ext = path.extname(file.name).slice(1).toLowerCase();
  if (ext && CAREERS_CV_EXT.has(ext)) return ext;
  if (file.type === "application/pdf") return "pdf";
  if (file.type === "application/msword") return "doc";
  if (
    file.type ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return "docx";
  }
  return null;
}

export async function saveCareerCv(file: File): Promise<{
  url: string;
  fileName: string;
}> {
  const ext = extensionFromCv(file);
  if (!ext) {
    throw new Error("Adjuntá el CV en PDF, DOC o DOCX.");
  }

  const allowedType =
    CAREERS_CV_TYPES.has(file.type) ||
    file.type === "" ||
    file.type === "application/octet-stream";
  if (!allowedType && !CAREERS_CV_EXT.has(ext)) {
    throw new Error("Adjuntá el CV en PDF, DOC o DOCX.");
  }

  const maxBytes = Math.round(CAREERS_CV_MAX_MB * 1024 * 1024);
  if (file.size > maxBytes) {
    throw new Error(
      `El CV supera el máximo de ${CAREERS_CV_MAX_MB} MB.`,
    );
  }
  if (file.size < 1) {
    throw new Error("El archivo del CV está vacío.");
  }

  const safeBase = `cv-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
  const filename = `${safeBase}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const contentType = file.type || "application/octet-stream";

  if (useBlobStorage()) {
    const url = await writeBlobFile(
      blobKeyForUpload(filename),
      buffer,
      contentType,
    );
    return { url, fileName: file.name || filename };
  }

  if (isVercelDeploy()) {
    throw new Error(blobStorageRequiredMessage());
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads", "careers");
  await fs.mkdir(uploadsDir, { recursive: true });
  const diskPath = path.join(uploadsDir, filename);
  await fs.writeFile(diskPath, buffer);
  return { url: `/uploads/careers/${filename}`, fileName: file.name || filename };
}
