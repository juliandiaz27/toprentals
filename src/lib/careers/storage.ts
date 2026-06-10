import { dataFilePath } from "@/lib/repoRoot";
import { readJsonFile, writeJsonFile } from "@/lib/fsJson";
import type { CareerApplicationStored, CareerApplicationsFile } from "./types";

const DEFAULT: CareerApplicationsFile = { applications: [] };

const filePath = () => dataFilePath("careers-applications.json");

export async function readCareerApplications(): Promise<CareerApplicationStored[]> {
  const data = await readJsonFile<CareerApplicationsFile>(filePath(), DEFAULT);
  return Array.isArray(data.applications) ? data.applications : [];
}

export async function appendCareerApplication(
  entry: Omit<CareerApplicationStored, "id" | "createdAt">,
): Promise<CareerApplicationStored> {
  const applications = await readCareerApplications();
  const stored: CareerApplicationStored = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...entry,
  };
  applications.unshift(stored);
  await writeJsonFile(filePath(), { applications });
  return stored;
}
