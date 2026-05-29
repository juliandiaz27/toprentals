import { dataFilePath } from "@/lib/repoRoot";
import { readJsonFile, writeJsonFile } from "@/lib/fsJson";

const FILE = () => dataFilePath("egresados-data.json");

export type Egresado = {
  id: string;
  name: string;
  career: string;
  year: number;
  imageSrc: string;
};

export type EgresadosData = {
  items: Egresado[];
};

const DEFAULT: EgresadosData = { items: [] };

export async function readEgresados(): Promise<EgresadosData> {
  return readJsonFile(FILE(), DEFAULT);
}

export async function writeEgresados(data: EgresadosData): Promise<void> {
  await writeJsonFile(FILE(), data);
}
