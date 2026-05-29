import { revalidatePath } from "next/cache";

export type EntityKind =
  | "profesores"
  | "egresados"
  | "carreras"
  | "cursos"
  | "postitulos"
  | "beneficios";

const PUBLIC_PATHS: Record<EntityKind, string[]> = {
  profesores: ["/profesores", "/"],
  egresados: ["/egresados", "/"],
  carreras: ["/carreras", "/"],
  cursos: ["/cursos", "/"],
  postitulos: ["/postitulos", "/"],
  beneficios: ["/beneficios", "/"],
};

export function revalidateEntity(kind: EntityKind): void {
  for (const p of PUBLIC_PATHS[kind]) {
    revalidatePath(p);
  }
  revalidatePath("/", "layout");
}

export function revalidateConfigImages(): void {
  revalidatePath("/");
  revalidatePath("/", "layout");
}
