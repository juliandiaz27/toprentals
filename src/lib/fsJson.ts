import fs from "fs/promises";
import path from "path";
import {
  blobKeyFromFilePath,
  blobStorageRequiredMessage,
  isVercelDeploy,
  readBlobJson,
  useBlobStorage,
  writeBlobJson,
} from "@/lib/vercelBlob";

export async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  const blobKey = blobKeyFromFilePath(filePath);

  if (useBlobStorage()) {
    const fromBlob = await readBlobJson<T>(blobKey);
    if (fromBlob !== null) return fromBlob;
  }

  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "ENOENT") {
      if (isVercelDeploy()) {
        return fallback;
      }
      await writeJsonFile(filePath, fallback);
      return fallback;
    }
    throw err;
  }
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
