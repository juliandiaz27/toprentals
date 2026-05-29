import { dataFilePath } from "@/lib/repoRoot";
import { readJsonFile, writeJsonFile } from "@/lib/fsJson";

const FILE = () => dataFilePath("image-config.json");

export type ImageConfig = Record<string, string>;

const DEFAULT_CONFIG: ImageConfig = {};

export async function readImageConfig(): Promise<ImageConfig> {
  return readJsonFile(FILE(), DEFAULT_CONFIG);
}

export async function writeImageConfig(config: ImageConfig): Promise<void> {
  await writeJsonFile(FILE(), config);
}

export async function getImageUrl(
  key: string,
  fallback: string,
): Promise<string> {
  const config = await readImageConfig();
  return config[key] ?? fallback;
}
