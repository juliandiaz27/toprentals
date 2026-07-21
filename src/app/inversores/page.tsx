import { redirect } from "next/navigation";

/** Alias legacy: el CTA del home debe ir a Propietarios. */
export default function InversoresPage() {
  redirect("/propietarios");
}
