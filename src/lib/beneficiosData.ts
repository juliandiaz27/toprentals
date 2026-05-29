import { dataFilePath } from "@/lib/repoRoot";
import { readJsonFile, writeJsonFile } from "@/lib/fsJson";

const FILE = () => dataFilePath("beneficios-data.json");

export type Beneficio = {
  id: string;
  title: string;
  discount: string;
  url: string;
  imageSrc: string;
  visible: boolean;
};

export type BeneficiosData = {
  items: Beneficio[];
};

const DEFAULT: BeneficiosData = { items: [] };

export async function readBeneficios(): Promise<BeneficiosData> {
  return readJsonFile(FILE(), DEFAULT);
}

export async function writeBeneficios(data: BeneficiosData): Promise<void> {
  await writeJsonFile(FILE(), data);
}
