import { dataFilePath } from "@/lib/repoRoot";
import { readJsonFile, writeJsonFile } from "@/lib/fsJson";

const FILE = () => dataFilePath("profesores-data.json");

export type Profesor = {
  id: string;
  name: string;
  role: string;
  imageSrc: string;
};

export type ProfesoresData = {
  items: Profesor[];
};

const DEFAULT: ProfesoresData = { items: [] };

export async function readProfesores(): Promise<ProfesoresData> {
  return readJsonFile(FILE(), DEFAULT);
}

export async function writeProfesores(data: ProfesoresData): Promise<void> {
  await writeJsonFile(FILE(), data);
}
