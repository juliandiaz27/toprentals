import { readProfesores } from "@/lib/profesoresData";
import { ProfesoresManager } from "../../ProfesoresManager";

export const dynamic = "force-dynamic";

export default async function AdminProfesoresPage() {
  const data = await readProfesores();
  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold text-neutral-900">Profesores</h1>
      <ProfesoresManager initialItems={data.items} />
    </div>
  );
}
