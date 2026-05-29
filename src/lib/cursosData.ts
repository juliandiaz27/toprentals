import { dataFilePath } from "@/lib/repoRoot";
import { readJsonFile, writeJsonFile } from "@/lib/fsJson";

const FILE = () => dataFilePath("cursos-data.json");

export type Curso = {
  id: string;
  slug: string;
  title: string;
  visible: boolean;
  imageSrc: string;
  modalidad: string;
  duracion: string;
  location: string;
  description: string;
};

export type CursosData = {
  items: Curso[];
};

const DEFAULT: CursosData = { items: [] };

export async function readCursos(): Promise<CursosData> {
  return readJsonFile(FILE(), DEFAULT);
}

export async function writeCursos(data: CursosData): Promise<void> {
  await writeJsonFile(FILE(), data);
}
