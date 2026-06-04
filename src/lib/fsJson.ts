import fs from "fs/promises";
import path from "path";
import { deepMerge, isEmptyObject } from "@/lib/deepMerge";
import {
  blobKeyFromFilePath,
  blobStorageRequiredMessage,
  isVercelDeploy,
  readBlobJson,
  useBlobStorage,
  writeBlobJson,
} from "@/lib/vercelBlob";

async function readJsonFromDisk<T>(filePath: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "ENOENT") return null;
    throw err;
  }
}

export async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  const blobKey = blobKeyFromFilePath(filePath);
  const fromDisk = await readJsonFromDisk<T>(filePath);

  if (useBlobStorage()) {
    const fromBlob = await readBlobJson<T>(blobKey);

    if (fromBlob === null || isEmptyObject(fromBlob)) {
      if (fromDisk !== null) return fromDisk;
      return fallback;
    }

    if (fromDisk !== null) {
      return deepMerge(
        fromDisk as Record<string, unknown>,
        fromBlob as Record<string, unknown>,
      ) as T;
    }

    return fromBlob;
  }

  if (fromDisk !== null) return fromDisk;

  if (isVercelDeploy()) {
    return fallback;
  }

  await writeJsonFile(filePath, fallback);
  return fallback;
}

export async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  if (useBlobStorage()) {
    await writeBlobJson(blobKeyFromFilePath(filePath), data);
    return;
  }

  if (isVercelDeploy()) {
    throw new Error(blobStorageRequiredMessage());
  }

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2) + "\n", "utf-8");
}
