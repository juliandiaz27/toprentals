import { revalidatePath } from "next/cache";

export function revalidateConfigImages(): void {
  revalidatePath("/");
  revalidatePath("/", "layout");
}
