import { dataFilePath } from "@/lib/repoRoot";
import { readJsonFile, writeJsonFile } from "@/lib/fsJson";

const FILE = () => dataFilePath("carreras-data.json");

export type Carrera = {
  id: string;
  slug: string;
  title: string;
  visible: boolean;
  imageSrc: string;
  modalidad: string;
  duracion: string;
  location: string;
  description: string;
  requisitos: string;
};

export type CarrerasData = {
  items: Carrera[];
};

const DEFAULT: CarrerasData = { items: [] };

export async function readCarreras(): Promise<CarrerasData> {
  return readJsonFile(FILE(), DEFAULT);
}

export async function writeCarreras(data: CarrerasData): Promise<void> {
  await writeJsonFile(FILE(), data);
}
