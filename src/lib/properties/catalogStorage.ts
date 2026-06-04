import { dataFilePath } from "@/lib/repoRoot";
import { readJsonFile, writeJsonFile } from "@/lib/fsJson";
import type { PropertiesCatalogFile } from "./catalogTypes";
const DEFAULT_CATALOG: PropertiesCatalogFile = {
  featuredSlugs: [
    "belgrano",
    "wow-nunez",
    "dorrego",
    "montaneses",
    "qorner",
  ],
  listings: [],
};

export async function readPropertiesCatalog(): Promise<PropertiesCatalogFile> {
  const data = await readJsonFile<PropertiesCatalogFile>(
    dataFilePath("properties-catalog.json"),
    DEFAULT_CATALOG,
  );
  return {
    featuredSlugs: Array.isArray(data.featuredSlugs) ? data.featuredSlugs : [],
    listings: Array.isArray(data.listings) ? data.listings : [],
  };
}

export async function writePropertiesCatalog(
  data: PropertiesCatalogFile,
): Promise<void> {
  await writeJsonFile(dataFilePath("properties-catalog.json"), data);
}
