import { readProfesores } from "@/lib/profesoresData";
import { ProfesoresManager } from "../../ProfesoresManager";

export const dynamic = "force-dynamic";

export default async function AdminProfesoresPage() {
  const data = await readProfesores();
  return <ProfesoresManager initialItems={data.items} />;
}
