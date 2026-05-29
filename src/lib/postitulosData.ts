import { dataFilePath } from "@/lib/repoRoot";
import { readJsonFile, writeJsonFile } from "@/lib/fsJson";

const FILE = () => dataFilePath("postitulos-data.json");

export type Postitulo = {
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

export type PostitulosData = {
  items: Postitulo[];
};

const DEFAULT: PostitulosData = { items: [] };

export async function readPostitulos(): Promise<PostitulosData> {
  return readJsonFile(FILE(), DEFAULT);
}

export async function writePostitulos(data: PostitulosData): Promise<void> {
  await writeJsonFile(FILE(), data);
}
